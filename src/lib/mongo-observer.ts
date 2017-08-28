import { Collection, Db, MongoClient } from "mongodb";
import {
  AsyncSubject,
  Observable,
  Observer,
  ReplaySubject,
  Subject
} from "rxjs";
import { GeyserType } from "./types";

/**
 * An observer which writes events from an observable to a MongoDB collection.
 */
export class MongoObserver implements Observer<GeyserType> {
  /**
   * Create a new MongoObserver.
   */
  public static create({
    db,
    // name of the capped collection to which this observer should write
    collection,
    // maximum number of documents in underlying capped collection
    max = 1000,
    // Maximum size of underlying capped collection
    size = 5242880,
    // number of values to buffer while waiting for MongoDB connection
    bufferSize = Number.POSITIVE_INFINITY,
    // milliseconds to buffer while waiting for MongoDB connection
    bufferTime = Number.POSITIVE_INFINITY
  }: {
    db: string | Db;
    collection: string;
    max?: number;
    size?: number;
    bufferSize?: number;
    bufferTime?: number;
  }) {
    return typeof db === "string"
      ? new MongoObserver(
          collection,
          Observable.fromPromise(MongoClient.connect(db)),
          max,
          size,
          bufferSize,
          bufferTime
        )
      : new MongoObserver(
          collection,
          Observable.of(db),
          max,
          size,
          bufferSize,
          bufferTime
        );
  }

  private connectInitiated = false;
  private isConnected = false;

  private mongoCollection: AsyncSubject<Collection> = new AsyncSubject();
  private writer: Subject<GeyserType> = new Subject();
  private buffer: ReplaySubject<GeyserType>;

  private constructor(
    private collection: string,
    private db: Observable<Db>,
    private max: number,
    private size: number,
    bufferSize: number,
    bufferTime: number
  ) {
    this.buffer = new ReplaySubject(bufferSize, bufferTime);

    // Automatically connect when the buffer begins to receive events or signals
    this.buffer.take(1).subscribe({
      complete: () => this.connect(),
      error: () => this.connect()
    });

    this.mongoCollection.subscribe(colInstance => {
      this.writeInit();
      this.writer.subscribe({
        complete: this.writeComplete,
        error: this.writeError,
        next: this.writeNext
      });
    });
  }

  /**
   * Immediately connect this MongoObserver to the database, create the 
   * collection (if it doesn't exist), and check that the collection has the 
   * expected stats.
   */
  public connect(
    // error: (error: any) => void,
    error = console.error,
    complete = () => {
      return;
    }
  ) {
    this.doSubscribe({
      complete,
      error,
      next: () => {
        return;
      }
    });
    return this;
  }

  public close() {
    // TODO: close DB connection
  }

  public next(value: GeyserType) {
    return this.isConnected ? this.writer.next(value) : this.buffer.next(value);
  }

  public complete() {
    return this.isConnected ? this.writer.complete() : this.buffer.complete();
  }

  public error(err: GeyserType) {
    return this.isConnected ? this.writer.error(err) : this.buffer.error(err);
  }

  /**
   * Subscribe to the connection of this MongoObserver to MongoDB. 
   */
  private doSubscribe(observer: Observer<MongoObserver>) {
    this.db
      .take(1)
      .switchMap(dbInstance =>
        // create the collection if it doesn't exist
        dbInstance.createCollection(this.collection, {
          capped: true,
          max: this.max,
          size: this.size
        })
      )
      .do(collectionInstance => this.mongoCollection.next(collectionInstance))
      .switchMap(collectionInstance => collectionInstance.stats())
      .map(stats => {
        let error = "";
        if (!stats.capped) {
          error = "collection must be capped.";
        }
        if (stats.maxSize !== this.size) {
          error = `expected collection maxSize of ${this
            .size}, but got ${stats.maxSize}.`;
        }
        if (stats.max !== this.max) {
          error = `expected collection max (documents) of ${this
            .max}, but got ${stats.max}.`;
        }
        if (error) {
          throw new Error(
            `MongoObserver tried to connect to an incompatible '${this
              .collection}' collection: ${error}`
          );
        }
      })
      .subscribe({
        complete: () => {
          this.isConnected = true;
          this.mongoCollection.complete();
          this.writer.subscribe(this.buffer);
          // TODO: delete the buffer now that it's been replayed
          observer.complete();
        },
        error: (err: any) => {
          observer.error(err);
        },
        next: () => {
          observer.next(this);
        }
      });
  }

  /* tslint:disable:no-console */

  private writeInit() {
    // TODO: write "stream init" document to mongo so observables can seek to latest stream
    console.log("TODO: write init");
  }

  private writeNext(val: any) {
    // TODO: write "next" document to mongo
    console.log("TODO: write next", val);
  }

  private writeComplete() {
    // TODO: write "complete" document to mongo
    console.log("TODO: write complete");
  }

  private writeError(err: any) {
    // TODO: write "error" document to mongo
    console.log("TODO: write error", err);
  }
}

import { Collection, Db, MongoClient } from "mongodb";
import { AsyncSubject, Observable, Observer } from "rxjs";
import { GeyserType } from "./types";

/**
 * An observer which adds messages to a given MongoDB collection.
 */
export class MongoObserver implements Observer<GeyserType> {
  /**
   * Create a new MongoObserver given an open MongoDB connection.
   */
  public static create(opts: { db: Db; collection: string }) {
    return new MongoObserver({
      collection: opts.collection,
      db: Observable.of(opts.db)
    });
  }

  /**
   * Create a new MongoObserver by creating a new MongoDB connection. 
   */
  public static connect(opts: { uri: string; collection: string }) {
    return new MongoObserver({
      collection: opts.collection,
      db: Observable.fromPromise(MongoClient.connect(opts.uri))
    });
  }

  private mongoCollection: AsyncSubject<Collection>;

  private constructor({
    db,
    collection,
    max = 1000, // maximum number of documents
    size = 5000000, // 5 MB
    handler = { // 
      error: err => {
        throw err;
      }
    }
  }: {
    db: Observable<Db>;
    collection: string;
    max?: number;
    size?: number;
    handler?: Observer<any>;
  }) {
    db
      .take(1)
      .switchMap(dbInstance =>
        // create the collection if it doesn't exist
        dbInstance.createCollection(collection, {
          capped: true,
          max,
          size
        })
      )
      .do(collectionInstance => this.mongoCollection.next(collectionInstance))
      .switchMap(collectionInstance => collectionInstance.stats())
      .map(stats => {
        // error if the collection does not have expected `max` and `size` values
        // (if the collection already exists, it will not be modified by createCollection)
        // Waiting on: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/19334
        if (!stats.capped || stats.maxSize !== size || stats.max !== max) {
          throw new Error(
            "MongoObserver tried to connect to an incompatible collection."
          );
        }
      })
      .subscribe(handler);
  }

  public next(value: GeyserType) {
    //
  }

  public complete() {
    //
  }

  public error(err: GeyserType) {
    //
  }
}

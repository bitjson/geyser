import { Db, MongoClient } from "mongodb";
import { Observable, Observer } from "rxjs";

export interface MongoObservableOptions {
  db: Db;
  collection: string;
}

/**
 * An observable which emits messages added to a given MongoDB collection.
 */
export class MongoObservable extends Observable<any> {
  /**
   * Create a new MongoObservable given an open MongoDB connection. 
   */
  public static create(opts: { db: Db; collection: string }) {
    return new MongoObservable(opts);
  }

  /**
   * Create a new MongoObservable by creating a new MongoDB connection. 
   */
  public static connect(opts: { uri: string; collection: string }) {
    return Observable.create((observer: Observer<any>) => {
      MongoClient.connect(opts.uri).then(db => {
        return new MongoObservable({
          collection: opts.collection,
          db
        }).subscribe(observer);
      });
    });
  }
  private constructor(opts: { db: Db; collection: string }) {
    super();
  }
}

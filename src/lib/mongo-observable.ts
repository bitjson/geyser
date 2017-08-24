import { Db } from "mongodb";

export interface MongoObservableOptions {
  db: Db;
  collection: string;
}

export class MongoObservable {
  /**
   * Returns an observable which emits messages added to the provided collection. 
   */
  public static create(opts: MongoObservableOptions) {
    return new MongoObservable(opts);
  }
  private constructor(opts: MongoObservableOptions) {}
}

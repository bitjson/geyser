import { Db } from "mongodb";

export interface MongoObserverOptions {
  db: Db;
  collection: string;
}

export class MongoObserver {
  /**
   * Returns an observer which adds messages to the provided collection. 
   */
  public static create(opts: MongoObserverOptions) {
    return new MongoObserver(opts);
  }
  private constructor(opts: MongoObserverOptions) {}
}

import { test } from "ava";
import { MongoObserver, MongoObservable } from "./";

test("library exports an observable and an observer", t => {
  t.truthy(MongoObserver);
  t.truthy(MongoObservable);
});

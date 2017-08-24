import { test } from "ava";
import { Db } from "mongodb";

import { MongoObservable } from "./mongo-observable";

const dbMock = () => (({} as any) as Db);

test("MongoObservable can be created", t => {
  const observable = MongoObservable.create({
    collection: "test-collection",
    db: dbMock()
  });
  t.truthy(observable);
});

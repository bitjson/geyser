import { test } from "ava";
import { Db } from "mongodb";

import { MongoObserver } from "./mongo-observer";

const dbMock = () => (({} as any) as Db);

test("MongoObserver can be created", t => {
  const observer = MongoObserver.create({
    collection: "test-collection",
    db: dbMock()
  });
  t.truthy(observer);
});

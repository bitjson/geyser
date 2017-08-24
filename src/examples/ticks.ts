// import {} from "mongodb";
import { MongoClient } from "mongodb";
import { Observable } from "rxjs";

import { MongoObservable, MongoObserver } from "../";

const url =
  process.argv[2] ||
  process.env.MONGO_URL ||
  "mongodb://localhost/geyser-testing";

MongoClient.connect(url).then(db => {
  const ticksIn = MongoObserver.create({
    collection: "ticks",
    db
  });

  const ticksOut = MongoObservable.create({
    collection: "ticks",
    db
  });

  /* tslint:disable:no-console */
  console.log("Testing latency through MongoDB at 1 second intervals...");

  Observable.interval(1000)
    .take(60)
    .map(i => i.toString())
    .do(i => console.time(i));
  // .subscribe(ticksIn);

  // ticksOut.subscribe({
  //   complete: () => db.close(),
  //   next: (i: string) => console.timeEnd(i)
  // });
});

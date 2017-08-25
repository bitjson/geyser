[![Build Status](https://travis-ci.org/bitjson/geyser.svg?branch=master)](https://travis-ci.org/bitjson/geyser)
[![Codecov](https://img.shields.io/codecov/c/github/bitjson/geyser.svg)](https://codecov.io/gh/bitjson/geyser)
[![NPM version](https://img.shields.io/npm/v/geyser-mongo.svg)](https://www.npmjs.com/package/geyser-mongo)
[![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)
[![dependencies Status](https://david-dm.org/bitjson/geyser/status.svg)](https://david-dm.org/bitjson/geyser)
[![devDependencies Status](https://david-dm.org/bitjson/geyser/dev-status.svg)](https://david-dm.org/bitjson/geyser?type=dev)

# Geyser

Publish and subscribe to streams of data over MongoDB.

## Example

In the source Node.js process, create a MongoObserver which writes to a 'ticks' collection in MongoDB. Then subscribe it to a data source (in this example, an interval).

```js
import { Observable } from 'rxjs';
import { MongoObserver } from 'geyser-mongo';

const ticks = MongoObserver.connect({
  url: 'mongodb://localhost/my-db',
  collection: 'ticks'
})

Observable.interval(1000).take(5).subscribe(ticks);
```

In the listening Node.js process, create a MongoObservable which emits messages written to the "ticks" collection.

```js
import { MongoObservable } from 'geyser-mongo';

const ticks = MongoObservable.connect({
  url: 'mongodb://localhost/my-db',
  collection: 'ticks'
})

ticks.subscribe({
  next: console.log,
  complete: () => console.log('Complete.')
});

// 0
// 1
// 2
// 3
// 4
// Complete.
```

Each time a value is delivered to the MongoObserver, the MongoSubscriber will emit. The observable will also emit `error` and `complete` signals.

`MongoObservable` and `MongoObserver` can also be created from an existing MongoDB connection.

```js
import { MongoClient } from "mongodb";
import { Observable } from 'rxjs';
import { MongoObservable, MongoObserver } from 'geyser-mongo';

MongoClient.connect(url).then(db => {
  const ticksIn = MongoObserver.create({
    collection: "ticks",
    db
  });

  const ticksOut = MongoObservable.create({
    collection: "ticks",
    db
  });

  // later...
  db.close();
}
```
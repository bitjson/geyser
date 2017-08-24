[![Build Status](https://travis-ci.org/bitjson/geyser.svg?branch=master)](https://travis-ci.org/bitjson/geyser)
[![Codecov](https://img.shields.io/codecov/c/github/bitjson/geyser.svg)](https://codecov.io/gh/bitjson/geyser)
[![NPM version](https://img.shields.io/npm/v/geyser-mongo.svg)](https://www.npmjs.com/package/geyser-mongo)
[![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)
[![dependencies Status](https://david-dm.org/bitjson/geyser/status.svg)](https://david-dm.org/bitjson/geyser)
[![devDependencies Status](https://david-dm.org/bitjson/geyser/dev-status.svg)](https://david-dm.org/bitjson/geyser?type=dev)

# Geyser

Publish and subscribe to streams of data over MongoDB.

## Usage

Source Node.js process:

```js
import { Observable } from 'rxjs';
import { MongoObserver } from 'geyser-mongo';

// Create an Observer which writes to a 'ticks' collection in MongoDB
const ticks = MongoObserver.connect({
  url: 'mongodb://localhost/my-db',
  collection: 'ticks'
})

// Subscribe our "ticks" observer to a stream
Observable.interval(1000).subscribe(ticks);
```

Listening Node.js process:

```js
import { MongoObservable } from 'geyser-mongo';

// create a 
const ticks = MongoObservable.connect({
  url: 'mongodb://localhost/my-db',
  collection: 'ticks'
})

// Subscribe to the "ticks" stream
ticks.subscribe(console.log);

// 1
// 2
// 3
// ...

```
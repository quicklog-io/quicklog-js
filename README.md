quicklog-js
=========

JavaScript (ES6) client library (SDK) for the Quicklog.io API

## Quick Start

- `npm install quicklogjs --save`

Create the file `index.js` with the following contents.
Remember to use your own *Project Id* and *API Key* (in place of `12345` and `my-api-key`) below:

```
const quicklogjs = require('quicklogjs');
quicklogjs.config({ projectId: 12345, apiKey: 'my-api-key', source: 'my-program' });
const { quicklog, quicktag, traceOpts, generateId } = quicklogjs;

const trace = traceOpts('user:me', '', '');
const tags = ['name1:value1', 'value', 'name1:value:with:colons', ':value:with:colons'];
const context = {key: 'value'};

quicklog('a-type', 'object:1', 'target:2', context, tags, trace)
  .then(function(res) {
          console.log('OK: Logged');
        },
        function(err) {
          console.log('Error: ' + err);
        });
```

Run the test:

- `node index.js`

It should send a log entry to api.quicklog.io and print `OK: Logged`.

Verify that the entry was logged:

- `curl -si 'https://api.quicklog.io/entries?project_id=12345&api_key=my-api-key'`

Verify that the tag was associated:

- `curl -si 'https://api.quicklog.io/entries?tag=name1:value1&project_id=12345&api_key=my-api-key'`, or
- `curl -si 'https://api.quicklog.io/entries?tag=value1&project_id=12345&api_key=my-api-key'`

## Functions

### config({ projectId: 12345, apiKey: 'my-api-key', source: 'my-source' })

The `config` function is used to set global settings.
Both `projectId` and `apiKey` are required.
Using a unique `source` value for each service or subsystem will make easier to follow trace logs.

### quicklog(type, object, target, context, tags, trace)

The `quicklog` function is what sends a log entry to the quicklog server. Parameters:

- `type` is an event name string, such as a user action or system event
- `object` is a string identifying the primary thing the log is about
- `target` is a string identifying a secondary thing the log is about
- `context` is a hash/object of application-defined string key/values
- `tags` is a list of tag strings, each of the form 'key:value' or 'value' or ':value:with:three:colons'
- `trace` is a value created by traceOpts(action, traceId, parentSpanId)`

### quicktag(tag, trace)

The `quicktag` function is for associating an application defined value (or key:value) with a `traceId`. Normally tags are added at the same time a log entry is created. A given tag only needs to be added once per unique `traceId`.

The `tag` parameter is a string of the form 'a value' or 'key:value'. If you want to use a value with no key but the value itself contains a colon (`:`) then you can use the form ':value:containing:colons'

The `trace` parameter is a value made using `traceOpts(action, traceId, parentSpanId)`.

Note that associating a tag with a traceId doesn't create a visible log. It's purpose is to allow searching of logged traces by tags. For instance a tag `order:5678` could mean that the logs for a trace with that tag pertain to a customer's order number 5678.

### traceOpts(actorId, traceId, parentSpanId)

The `traceOpts` function is used to make a value that typically doesn't change during the processing of an action or event. It consists of three strings representing an `actorId` (e.g. 'user:1234'), and a `traceId` and `parentSpanId` which are generated hex strings used for [Zipkin](https://zipkin.io/) [distributed tracing](https://github.com/openzipkin/b3-propagation).

Do not call this multiple times with the same parameters (except in special cases). The returned value contains a randomly generated `spanId`. Normally the same traceOpts value is used throughout the processing a single request/event. One case where you would call it a second time is if the current flow of processing starts another async task to do some related work. When the async task starts, it could call `traceOpts(trace.actorId, trace.traceId, trace.parentSpanId)` and use that returned value throughout. Alternatively the async task could use the value from `traceOpts(trace.actorId, trace.traceId, trace.spanId` which would make its logs appear as a child sequence rather than a sibling of the originating one.

## generateId()

The `generateId` function is used by `traceOpts` to generate a random hex string for use as a `traceId`/`parentSpanId`/`spanId`.

## Sample

Look in the [examples/simple](../../tree/master/examples/simple) directory for a basic example, similar to what's shown next in 'Usage'.

## Usage

   See the [examples](examples) directory for more.

## Tests

  `npm test`

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.

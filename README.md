quicklog-js
=========

JavaScript (ES6) client library (SDK) for the Quicklog.io API

## Installation

  `npm install quicklogjs`

## Usage

Remember to use your own 'projectId' and 'apiKey' below:
```
const quicklogjs = require('quicklogjs');
quicklogjs.config({ projectId: 123456, source: 'my-test-program', apiKey: 'your-api-key' });
const { quicklog, quicktag, traceOpts, generateId } = quicklogjs;

const trace = traceOpts('user:me', '', '');
const tags = ['name1:value1', 'value', 'name1:value:with:colons', ':value:with:colons'];
const context = {key: 'value'};

quicklog('a-type', 'object:1', 'target:2', context, tags, trace)
  .then(function(res) {
          console.log('GOOD: response=' + JSON.stringify(res));
        },
        function(err) {
          console.log('BAD: error=' + err);
        });
```

   See the [examples](examples) directory for more.


## Tests

  `npm test`

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.

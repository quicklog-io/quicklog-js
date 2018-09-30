const quicklogjs = require('quicklogjs');
quicklogjs.config({ projectId: 10000, source: 'my-test-program', apiKey: 'your-api-key' });
const { quicklog, quicktag, traceOpts, generateId } = quicklogjs;

const trace = traceOpts('user:me', '', '');
const tags = ['name1:value1', 'value', 'name1:value:with:colons', ':value:with:colons'];
const context = {key: 'value'};

quicklog('a-type', 'object:1', 'target:2', context, tags, trace)
  .then(function(res) {
          console.log('GOOD: response: ' + JSON.stringify(res));
        },
        function(err) {
          console.log('BAD: ' + err);
        });

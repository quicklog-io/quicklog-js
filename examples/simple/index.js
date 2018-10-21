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

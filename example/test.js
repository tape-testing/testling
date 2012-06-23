var test = require('../');

test('json parse', function (t) {
    t.deepEqual(JSON.parse('[1,2]'), [1,2]);
    t.end();
});

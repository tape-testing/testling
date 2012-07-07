var test = require('../');

test('json parse', function (t) {
    t.same(JSON.parse('[1,2]'), [1,2]);
    t.log('beep boop');
    t.test('nested test', function (t) {
        t.ok(true, "nested ok")
        t.end()
    })
    t.end();
});

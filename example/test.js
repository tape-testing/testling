var test = require('tape');

test('beep boop', function (t) {
    t.plan(2);
    t.equal(1+1, 2);
    t.ok(true);
});

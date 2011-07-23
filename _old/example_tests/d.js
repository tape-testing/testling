var test = require('testling');

test('immediate', function (t) {
    t.equal('x', 'x');
    t.end();
});

test('delayed', function (t) {
    t.plan(2);
    t.equal('a', 'a');
    
    setTimeout(function () {
        t.equal(1, 1);
        t.end();
    }, 100);
});

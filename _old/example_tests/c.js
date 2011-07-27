var traverse = require('traverse');
var test = require('testling');

test('fast', function (t) {
    t.plan(20);
    
    var n = 0;
    var x = 0;
    var iv = setInterval(function () {
        if (n == 3 || n == 5) {
            t.equal(++n, x++);
        }
        else {
            t.equal(n++, x++);
        }
        
        if (n == 20) {
            clearInterval(iv);
            t.end();
        }
    }, 250);
});

test('slow', function (t) {
    t.plan(10);
    
    var n = 0;
    var x = 0;
    var iv = setInterval(function () {
        t.equal(n++, x++);
        if (n == 10) {
            clearInterval(iv);
            t.end();
        }
    }, 1000);
});

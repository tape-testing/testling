var traverse = require('traverse');

exports.fast = function (t) {
    t.plan(20);
    
    var n = 0;
    var x = 0;
    var iv = setInterval(function () {
        t.equal(n++, x++);
        if (n == 20) clearInterval(iv);
    }, 250);
};

exports.slow = function (t) {
    t.plan(10);
    
    var n = 0;
    var x = 0;
    var iv = setInterval(function () {
        t.equal(n++, x++);
        if (n == 10) clearInterval(iv);
    }, 1000);
};

var traverse = require('traverse');

exports.cmp = function (t) {
    var obj = { a : 1, b : 2 };
    t.deepEqual(
        traverse(obj).map(function (x) {
            if (typeof x === 'number') return x * 10
        }),
        { a : 10, b : 20 }
    );
    t.deepEqual(obj, { a : 1, b : 2 });
    t.end();
};

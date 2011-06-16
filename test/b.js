var traverse = require('traverse');

exports.naive = function (t) {
    t.plan(3);
    
    var a = [1];
    a.push(a);
    var b = [1];
    b.push(a);
    
    t.notDeepEqual(a, b);
    
    var c = [1];
    c.push(c);
    
    t.deepEqual(a, c);
    
    var d = [1];
    d.push(c);
    
    t.deepEqual(b, d);
};

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

var intestine = require('intestine')
var Test = require('./lib/test');

module.exports = function () {
    var guts = intestine(function (runner) {
        var require_ = runner.context.require || require;
        runner.counts = {
            pass : 0,
            fail : 0,
            total : 0,
            planned : 0
        };
        
        runner.context.require = function (lib) {
            if (lib === 'testling') {
                return function (name, cb) {
                    var t = new Test(name, runner);
                    
                    t.on('assert', function (res) {
                        if (res.ok) runner.counts.pass ++
                        else runner.counts.fail ++
                        runner.counts.total ++;
                    });
                    
                    t.on('plan', function (n) {
                        runner.counts.planned = (runner.counts.planned || 0) + n;
                        guts.emit('plan', n, t);
                    });
                    
                    t.filename = runner.filename;
                    runner.start(t);
                    cb(t);
                };
            }
            else return require_(lib);
        };
    });
    
    guts.counts = {
        pass : 0,
        fail : 0,
        total : 0,
        planned : 0
    };
    
    guts.on('assert', function (res) {
        if (res.ok) guts.counts.pass ++
        else guts.counts.fail ++;
        guts.counts.total ++;
    });
    
    guts.on('plan', function (n, t) {
        guts.counts.planned = guts.runners.reduce(function (s, c) {
            return (s + c.counts.planned) * (c.counts.planned > 0);
        }, 0);
    });
    
    guts.on('error', function (err) {
        guts.emit('assert', {
            thrown : true,
            error : err
        });
    });
    
    return guts;
};

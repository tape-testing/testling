var intestine = require('intestine')
var Test = require('./lib/test');

module.exports = function () {
    var guts = intestine(function (runner) {
        var require_ = runner.context.require || require;
        runner.context.require = function (lib) {
            if (lib === 'testling') {
                return function (name, cb) {
                    var t = new Test(name);
                    runner.start(t);
                    cb(t);
                };
            }
            else return require_(lib);
        };
    });
    
    guts.counts = { pass : 0, fail : 0, total : 0 };
    guts.on('assert', function (res) {
        if (res.ok) guts.counts.pass ++
        else guts.counts.fail ++;
        guts.counts.total ++;
    });
    
    return guts;
};

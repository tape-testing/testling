var fs = require('fs');
var path = require('path');

var seq = require('seq');
var test = require('../lib/test');

module.exports = function (args) {
    var files = args.reduce(function (acc, arg) {
        var s = fs.statSync(arg);
        if (s.isDirectory()) {
            var xs = fs.readdirSync(arg).map(function (x) {
                return path.resolve(arg, x)
            });
            return acc.concat(xs);
        }
        else return acc.concat(arg);
    }, []);
    
    seq(files).seqEach_(function (next, file) {
        test.browser = file;
        test.harness.once('end', function () {
            process.nextTick(next.ok)
        });
        
        try {
            require(path.resolve(process.cwd(), file));
        }
        catch (err) {
            console.log('');
            test.output('visit', file);
            test.output('launched', file);
            var lines = (err && err.stack || err).split(/\r?\n/);
            console.error('\r\n  ' + lines.slice(0,-7).join('\r\n') + '\r\n');
            
            next();
        }
    });
};

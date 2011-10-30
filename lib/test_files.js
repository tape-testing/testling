var fs = require('fs');
var path = require('path');

module.exports = function (args) {
    return args.reduce(function (acc, arg) {
        var s = fs.statSync(arg);
        if (s.isDirectory()) {
            var xs = fs.readdirSync(arg).map(function (x) {
                return path.resolve(arg, x)
            });
            return acc.concat(xs);
        }
        else return acc.concat(arg);
    }, []);
};

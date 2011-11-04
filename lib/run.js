var fs = require('fs');
var path = require('path');

var seq = require('seq');
var test = require('../lib/test');

module.exports = function (files) {
    seq(files).seqEach_(run);
};

function run (next, file) {
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
}

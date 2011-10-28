#!/usr/bin/env node
var path = require('path');
var fs = require('fs');

var args = process.argv.slice(2);
if (args.length === 0) {
    console.error('Usage: testling [test files]');
    process.exit(1);
}

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

var test = require('../lib/test');
var seq = require('seq');

seq(files).seqEach_(function (next, file) {
    test.browser = file;
    test.harness.on('end', function () {
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
    }
});


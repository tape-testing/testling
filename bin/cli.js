#!/usr/bin/env node
var http = require('http');
var fs = require('fs');
var path = require('path');

var runner = require('../lib/run');
var testFiles = require('../lib/test_files');
var streamFiles = require('../lib/stream_files');
var withConfig = require('../lib/with_config');

var parse = require('optimist')
    .usage('Usage: testling [test files] {OPTIONS}')
    .option('browsers', {
        alias : 'b',
        desc : 'Run your tests in real browsers on testling.com.\n'
            + 'Otherwise, run the tests with jsdom locally.'
    })
    .option('browserlist', {
        alias : 'l',
        desc : 'Show the available browsers on testling.com.'
    })
    .option('config', {
        default : process.env.HOME + '/.config/testling.json',
        desc : 'Read configuration information from this file.'
    })
;
var argv = parse.argv;

if (argv.browserlist) {
    var opts = {
        host : 'testling.com',
        path : '/browsers.json'
    };
    http.get(opts, function (res) {
        var body = '';
        res.on('data', function (buf) {
            body += buf.toString();
        });
        
        res.on('end', function () {
            if (res.statusCode !== 200) console.error(err)
            else {
                var xs = JSON.parse(body);
                var browsers = xs.reduce(function (acc, x) {
                    var s = x.split('/');
                    var b = s[0], v = s[1];
                    acc[b] = (acc[b] || []).concat(v);
                    return acc;
                }, {});
                
                Object.keys(browsers).forEach(function (name) {
                    console.log(name);
                    var vs = browsers[name].sort();
                    console.log('  [ ' + vs.join(', ') + ' ]');
                });
            }
        });
    });
}
else if (argv.browsers) {
    withConfig(argv.config, function (config) {
        var auth = 'basic ' + new Buffer(
            [ config.username, config.password ].join(':')
        ).toString('base64');
        
        var opts = {
            method : 'PUT',
            host : 'testling.com',
            port : 80,
            path : '/',
            headers : { authorization : auth }
        };
        var req = http.request(opts, function (res) {
            res.on('data', function (buf) {
                // ...
            });
        });
        streamFiles(testFiles(argv._)).pipe(req);
    });
}
else if (argv._.length) {
    runner(testFiles(argv._));
}
else {
    parse.showHelp();
}

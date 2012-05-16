#!/usr/bin/env node
var http = require('http');

var testling = require('testling'); // sets up the test output

var runner = require('../lib/run');
var testFiles = require('../lib/test_files');
var streamFiles = require('../lib/stream_files');
var withConfig = require('../lib/account/with_config');

var parse = require('optimist')
    .usage('Usage: testling [test files] {OPTIONS}')
    .option('browsers', {
        alias : 'b',
        desc : 'Run your tests remotely in real browsers on testling.com.'
    })
    .option('output', {
        alias : 'o',
        desc : 'The output format to use in remote mode.\r\n'
            + '      http://testling.com/docs/#output-parameter\r\n'
    })
    .option('noinstrument', {
        desc : 'Turn off instrumentation for particular files in remote mode.\r\n'
            + '      http://testling.com/docs/#noinstrument\r\n'
    })
    .option('main', {
        desc : 'Use a filename besides "test.js" to start multifile bundles.\r\n'
            + '      http://testling.com/docs/#main\r\n'
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
    withConfig(argv.config, function (err, config) {
        if (err) {
            console.error('\r\nError: ' + err);
            return;
        }
        
        var auth = 'basic ' + new Buffer(
            [ config.email, config.password ].join(':')
        ).toString('base64');
        
        var params = [ 'output', 'browsers', 'noinstrument', 'main' ]
            .reduce(function (acc, key) {
                if (typeof argv[key] === 'string') {
                    acc[key] = argv[key];
                }
                return acc;
            }, {})
        ;
        
        var query = Object.keys(params).map(function (key) {
            return escape(key) + '=' + escape(params[key]);
        }).join('&');
        
        var opts = {
            method : 'PUT',
            host : 'testling.com',
            port : 80,
            path : '/?' + query,
            headers : { authorization : auth },
        };
        var req = http.request(opts, function (res) {
            res.pipe(process.stdout);
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

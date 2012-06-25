#!/usr/bin/env node
var argv = require('optimist')
    .option('headless', { default : true, type : 'boolean' })
    .option('kill', { default : true, type : 'boolean' })
    .default('proxy', 'localhost:54045')
    .default('server', 'localhost:54046')
    .argv
;

var bundle = require('../lib/bundle')(argv._);

var insertProxy = require('../lib/proxy');
var producer = require('../lib/producer');

var script = '<script src="'
    + 'http://' + argv.server + '/proxy.js'
    + '"></script>'
;
var proxy = insertProxy(script, [ 'http://' + argv.server ]);
var server = (function () {
    var http = require('http');
    var ecstatic = require('ecstatic')(__dirname + '/../static');
    return http.createServer(function (req, res) {
        if (req.url.split('?')[0] === '/') {
            res.setHeader('content-type', 'text/html');
            res.end('<script>' + bundle + '</script>');
        }
        else ecstatic(req, res)
    });
})();

var launcher = require('../lib/launcher');
(function () {
    var pending = 2;
    var ports = {
        proxy : parseInt(argv.proxy.split(':')[1], 10),
        server : parseInt(argv.server.split(':')[1], 10),
    };
    proxy.listen(ports.proxy, onready);
    server.listen(ports.server, onready);
    function onready () {
        if (--pending !== 0) return;
        var browser = launcher(argv);
        withBrowser(browser);
    }
})();

var JSONStream = require('JSONStream');
var shoe = require('shoe');

function withBrowser (browser) {
    var sock = shoe(function (stream) {
        stream
            .pipe(JSONStream.parse([ true ]))
            .pipe(producer())
            .on('end', function () {
                if (argv.kill) {
                    process.exit();
                }
            })
            .pipe(process.stdout, { end : false })
        ;
    });
    sock.install(server, '/push');
    
    browser.on('exit', function () {
        server.close();
        proxy.close();
    });
}

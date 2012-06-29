#!/usr/bin/env node

var launcher = require('browser-launcher');
var testlingVisit = require('../lib/testling_visit');
var insertProxy = require('../lib/proxy');
var producer = require('../lib/producer');

var argv = require('optimist')
    .option('headless', { default : true, type : 'boolean' })
    .default('proxy', 'localhost:54045')
    .default('server', 'localhost:54046')
    .argv
;
var bundle = require('../lib/bundle')(argv._);
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

var JSONStream = require('JSONStream');
var shoe = require('shoe');
var sock = shoe(function (stream) {
    stream
        .pipe(JSONStream.parse([ true ]))
        .pipe(producer())
        .on('end', function () {
            if (argv.headless) {
                process.exit();
            }
        })
        .pipe(process.stdout, { end : false })
    ;
});
sock.install(server, '/push');

var pending = 2;
var ports = {
    proxy : parseInt(argv.proxy.split(':')[1], 10),
    server : parseInt(argv.server.split(':')[1], 10),
};
var uri = 'http://localhost:' + ports.server + '/?' + Math.random();

proxy.listen(ports.proxy, onready);
server.listen(ports.server, onready);

function onready () {
    if (--pending !== 0) return;
    
    if (argv.browser === 'echo') {
        console.log([
            uri, '  proxy:     localhost:' + ports.proxy
        ].join('\n'));
        return withBrowser(process);
    }
    
    if (/^testling\./.test(argv.browser)) {
        testlingVisit(uri, argv, function (err, res) {
            if (err) return console.error(err);
        });
        return;
    }
    
    launcher(function (err, launch) {
        if (err) return console.error(err);
        
        var opts = {
            headless : argv.headless,
            browser : argv.browser,
            version : argv.version,
            proxy : 'localhost:' + ports.proxy,
            noProxy : 'localhost:' + ports.server,
        };
        launch(uri, opts, function (err, ps) {
            if (err) return console.error(err);
            ps.on('exit', function () {
                server.close();
                proxy.close();
            });
        });
    });
}

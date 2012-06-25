#!/usr/bin/env node
var argv = require('optimist').argv;
var bundle = require('../lib/bundle')(argv._);

var insertProxy = require('../lib/proxy');
var producer = require('../lib/producer');

//var profileDir = '/tmp/' + Math.random().toString(16).slice(2);
var profileDir = '/tmp/02faf1b1';
(function () {
    var mkdirp = require('mkdirp');
    mkdirp.sync(profileDir);
})();

var port = {
    proxy : 54045,
    server : 54046
};

var script = '<script src="'
    + 'http://localhost:' + port.server + '/proxy.js'
    + '"></script>'
;
var proxy = insertProxy(script, [ 'http://localhost:' + port.server ]);
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
var browser;
(function () {
    var pending = 2;
    proxy.listen(port.proxy, onready);
    server.listen(port.server, onready);
    function onready () {
        if (--pending !== 0) return;
        browser = launcher({
            proxy : port.proxy,
            server : port.server,
            profileDir : profileDir,
        });
    }
})();

var JSONStream = require('JSONStream');
var shoe = require('shoe');
var sock = shoe(function (stream) {
    stream
        .pipe(JSONStream.parse([ true ]))
        .pipe(producer())
        .on('end', function () {
            server.close();
            proxy.close();
            browser.kill();
            
            process.exit();
        })
        .pipe(process.stdout, { end : false })
    ;
});
sock.install(server, '/push');

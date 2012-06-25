#!/usr/bin/env node
var shoe = require('shoe');
var http = require('http');
var ecstatic = require('ecstatic')(__dirname + '/../static');
var argv = require('optimist').argv;
var mkdirp = require('mkdirp');
var insertProxy = require('../lib/proxy');

//var profileDir = '/tmp/' + Math.random().toString(16).slice(2);
var profileDir = '/tmp/02faf1b1';
mkdirp.sync(profileDir);

var port = {
    proxy : 54045,
    server : 54046
};

var script = '<script src="'
    + 'http://localhost:' + port.server + '/proxy.js'
    + '"></script>'
;
var proxy = insertProxy(script, [ 'http://localhost:' + port.server ]);
proxy.listen(port.proxy);

var server = http.createServer(ecstatic);
server.listen(port.server);

var JSONStream = require('JSONStream');
var sock = shoe(function (stream) {
    var tapProducer = new(require('tap/lib/tap-producer'));
    stream
        .pipe(JSONStream.parse([ true ]))
        .pipe(tapProducer)
        .on('end', function () { console.log('--------') })
        .pipe(process.stdout, { end : false })
    ;
});
sock.install(server, '/push');

var spawn = require('child_process').spawn;
var args = [
    'google-chrome',
    '--proxy-server=localhost:' + port.proxy,
    '--user-data-dir=' + profileDir,
    'http://localhost:' + port.server
];
console.log(args.join(' '));
//spawn('xvfb-run', args, { env : { no_proxy : '' } });

#!/usr/bin/env node
var argv = require('optimist').argv;

//var profileDir = '/tmp/' + Math.random().toString(16).slice(2);
var profileDir = '/tmp/02faf1b1';
var mkdirp = require('mkdirp').sync(profileDir);

var script = '<script src="http://localhost:9595/proxy.js"></script>';
var insertProxy = require('../lib/proxy');

var port = 54045;
var proxy = insertProxy(script, [ 'http://localhost:9595' ]);
proxy.listen(port);

var http = require('http');
var ecstatic = require('ecstatic')(__dirname + '/../static');
var server = http.createServer(ecstatic);
server.listen(9595);
console.log([
    'no_proxy=""',
    'google-chrome',
    '--incognito',
    '--proxy-server=localhost:' + port,
    '--user-data-dir=' + profileDir,
    'http://localhost:9595'
].join(' '));

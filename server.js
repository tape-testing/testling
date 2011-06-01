var argv = require('optimist')
    .demand('url')
    .demand('tests')
    .options('mount', {
        desc : 'Prefix to mount testling routes at',
        default : '/testling',
    })
    .default('port', 8080)
    .argv
;
var testDir = argv.tests;

var fs = require('fs');
var path = require('path');
var url = require('url');

var version = JSON.parse(fs.readFileSync(__dirname + '/package.json')).version;
var browserify = require('browserify');

var express = require('express');

var app = express.createServer();
app.use(argv.mount, express.static(__dirname + '/static'));
app.listen(argv.port);

var httpProxy = require('http-proxy');
var proxy = new httpProxy.HttpProxy();

app.use(function (req, res, next) {
    if (req.url.slice(0, argv.mount.length) !== argv.mount) {
        var u = url.parse(argv.url);
        proxy.proxyRequest(req, res, {
            host : u.hostname,
            port : u.port || 80,
        });
    }
    else next();
});

var bundle = browserify({
    entry : __dirname + '/browser/main.js',
    base : {
        './test' : __dirname + '/browser/test.js',
        '_tests/node_modules/jquery' : __dirname + '/browser/jquery.js',
        _tests : path.resolve(process.cwd(), testDir),
    },
    mount : argv.mount + '/browserify.js',
    require : { jquery : 'jquery-browserify' },
});

var jadeify = require('jadeify');
bundle.use(jadeify(__dirname + '/views'));

app.use(bundle);

app.helpers({
    mount : argv.mount,
    version : version,
});

app.get(argv.mount, function (req, res) {
    res.render('index.jade', {
        layout : false,
        version : version,
    });
});

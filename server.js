var argv = require('optimist')
    .demand('url')
    .demand('tests')
    .options('mount', {
        desc : 'Prefix to mount testling routes at',
        default : '/testling',
    })
    .default('port', 8082)
    .argv
;
var fs = require('fs');
var util = require('util');
var path = require('path');
var url = require('url');

var testDir = path.resolve(process.cwd(), argv.tests);

var version = JSON.parse(fs.readFileSync(__dirname + '/package.json')).version;
var browserify = require('browserify');

var express = require('express');

var app = express.createServer();
app.use(argv.mount, express.static(__dirname + '/static'));
app.use(argv.mount, require('progressify'));

var jadeify = require('jadeify');
var fileify = require('fileify');

util.print('Generating bundle... ');
var bundle = browserify({
        mount : argv.mount + '/browserify.js',
        watch : true,
    })
    .require({ jquery : 'jquery-browserify' })
    .use(jadeify(__dirname + '/views', { watch : true }))
    .use(fileify('test_files', testDir, { watch : true }))
    .addEntry(__dirname + '/browser/main.js')
;

console.log('done');

app.helpers({
    mount : argv.mount,
    version : version,
});

app.get(argv.mount, function (req, res) {
    res.render('index.jade', {
        layout : false,
        version : version,
        modified : bundle.modified.getTime(),
    });
});

var httpProxy = require('http-proxy');
var proxy = new httpProxy.HttpProxy();

app.use(bundle);

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

console.log('Listening on :' + argv.port + argv.mount);
app.listen(argv.port);

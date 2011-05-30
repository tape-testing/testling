var argv = require('optimist')
    .demand(1)
    .options('mount', {
        desc : 'Prefix to mount testling routes at',
        default : '/testling',
    })
    .default('port', 8080)
    .argv
;
var testDir = argv._[0];

var fs = require('fs');
var path = require('path');
var version = JSON.parse(fs.readFileSync(__dirname + '/package.json')).version;
var browserify = require('browserify');

var express = require('express');

var app = express.createServer();
app.listen(argv.port);

var bundle = browserify({
    entry : __dirname + '/browser/main.js',
    base : {
        './test' : __dirname + '/browser/test.js',
        '_tests/node_modules/jquery' : __dirname + '/browser/jquery.js',
        _tests : path.resolve(process.cwd(), testDir),
    },
    mount : argv.mount + '/browserify.js',
    require : [ 'dnode', 'jquery-browserify' ],
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

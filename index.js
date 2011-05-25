var fs = require('fs');
var version = JSON.parse(fs.readFileSync(__dirname + '/package.json')).version;
var browserify = require('browserify');

var express = require('express');

exports.createServer = function (testDir, opts) {
    if (!opts) opts = {};
    if (!testDir) testDir = 'test';
    var app = express.createServer();
    
    var mount = opts.mount || '/testling';
    
    app.use(browserify({
        entry : __dirname + '/browser/main.js',
        base : testDir,
        mount : mount + '/browserify.js',
        require : [ 'dnode', 'jquery-browserify' ],
    }));
    
    app.helpers({
        mount : mount,
        version : version,
    });
    
    app.get(mount, function (req, res) {
        res.render('index.jade', {
            layout : false,
            version : version,
        });
    });
    
    return app;
};

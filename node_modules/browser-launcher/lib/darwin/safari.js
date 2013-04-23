var exec = require('child_process').exec;
var plist = require('plist');
var path = require('path');
var util = require('./util');
var exists = util.exists;
var currentPath;

var getPath = function(callback) {

    if (currentPath) {
        return callback(null, currentPath);
    }

    util.find('com.apple.Safari', function(err, p) {
        currentPath = p;
        callback(err, currentPath);
    });
};

var getVersion = function(callback) {
    getPath(function(err, p) {
        var pl = path.join(p, 'Contents', 'version.plist');
        plist.parseFile(pl, function(err, data) {
            callback(err, data[0].CFBundleShortVersionString);
        });
    });
};

exports.path = getPath;
exports.version = getVersion;

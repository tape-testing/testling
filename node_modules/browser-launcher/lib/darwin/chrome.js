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

    util.find('com.google.Chrome', function(err, p) {
        currentPath = p;
        callback(err, currentPath);
    });
};

var getVersion = function(callback) {
    getPath(function(err, p) {
        var pl = path.join(p, 'Contents', 'Info.plist');
        exists(pl, function(y) {
            if (y) {
                plist.parseFile(pl, function(err, data) {
                    callback(err, data[0].KSVersion);
                });
            } else {
                callback('not installed', null);
            }
        });
    });
};

exports.path = getPath;
exports.version = getVersion;

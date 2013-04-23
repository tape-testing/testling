var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');
var exists = fs.exists || path.exists;

exports.exists = exists;

exports.find = function(id, callback) {
    var pathQuery = 'mdfind "kMDItemCFBundleIdentifier=="' + id + '""';
    exec(pathQuery, function (err, stdout) {
        var loc = stdout.trim();
        if (loc === '') {
            loc = null;
            err = 'not installed';
        }
        callback(err, loc);
    });
};

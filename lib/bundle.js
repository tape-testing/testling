var browserify = require('browserify');
var path = require('path');

module.exports = function (testFiles, cb) {
    var bundle = browserify();
    testFiles.forEach(function (file) {
        bundle.add(path.join(__dirname, '..', file));
    });
    return bundle.bundle(cb);
};

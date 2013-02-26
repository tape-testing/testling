var browserify = require('browserify');
var path = require('path');

module.exports = function (testFiles, cb) {
    var bundle = browserify();
    testFiles.forEach(function (file) {
        bundle.add(path.join(process.cwd(), file));
    });
    return bundle.bundle(cb);
};

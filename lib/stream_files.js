var fs = require('fs');
var spawn = require('child_process').spawn;

module.exports = function (files) {
    if (files.length === 1) {
        return fs.createReadStream(files[0]);
    }
    else {
        return spawn('tar', [ '-cf-' ].concat(files));
    }
};

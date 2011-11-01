var fs = require('fs');
var spawn = require('child_process').spawn;

module.exports = function (files) {
    if (files.length === 1) {
        return fs.createReadStream(files[0]);
    }
    else {
        var ps = spawn('tar', [ '-chf-' ].concat(files));
        
        var err = '';
        ps.stderr.on('data', function (buf) {
            err += buf;
        });
        
        ps.stderr.on('end', function (buf) {
            if (err.length) ps.stdout.emit('error', err);
        });
        
        return ps.stdout;
    }
};

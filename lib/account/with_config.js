var fs = require('fs');
var path = require('path');

var stdin = process.stdin;
var stdout = process.stdout;

module.exports = function (configFile, cb) {
    if (!path.existsSync(configFile)) {
        console.log('To use this feature you\'ll need a browserling account.');
        stdout.write('your email: ');
        stdin.once('data', function (email) {
            email = email.toString().trim();
        });
        stdin.resume();
    }
};

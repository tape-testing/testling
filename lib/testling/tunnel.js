var withAuth = require('./auth');
var fs = require('fs');
var path = require('path');
var request = require('request');

var configDir = path.join(
    process.env.HOME || process.env.USERPROFILE,
    '.config'
);
var mkdirp = require('mkdirp');
mkdirp.sync(configDir);
var pidFile = path.join(configDir, 'testling_tunnels.pid');

var running = false;
if ((path.existsSync || fs.existsSync)(pidFile)) {
    var pid = parseInt(fs.readFileSync(pidFile, 'utf8').trim(), 10);
    if (pid && pid > 0) {
        try {
            kill(pid, 0);
            running = true; // didn't get ESRCH
        }
        catch (err) {}
    }
}

exports = module.exports = function (addr) {
    if (running) {
        console.error('# tunnel appears to be already running, trying anyhow');
    }
    
    withAuth(function (err, auth) {
        if (err) return cb(err);
        var u = 'http://' + auth.prefix + '@testling.com/tunnel';
        request(u, function checkBody (err, res, body) {
            if (err) return cb(err);
            
            var m = /ssh -NR (\d+:)\S+ (\S+)/.exec(body);
            if (m) {
                cb(null, [ 'ssh', '-NR', m[1] + addr, m[2] ]);
            }
            else if (/open a tunnel with:/i.test(body)) {
                request(u + '/open', checkBody)
            }
            else cb('unexpected response from server: ' + body)
        });
    });
};

exports.running = running;

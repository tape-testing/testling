var spawn = require('child_process').spawn;
var mkdirp = require('mkdirp');

//var profileDir = '/tmp/' + Math.random().toString(16).slice(2);
var profileDir = '/tmp/02faf1b1';
mkdirp.sync(profileDir);

module.exports = function (opts) {
    var args = [
        'google-chrome',
        '--proxy-server=' + opts.proxy,
        '--user-data-dir=' + profileDir,
        'http://' + opts.server + '/?' + Math.random()
    ];
    if (opts.headless) {
        args.unshift('xvfb-run', '-w', '0', '-a');
    }
    var ps = spawn(args[0], args.slice(1));
    return ps;
};

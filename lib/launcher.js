var spawn = require('child_process').spawn;

module.exports = function (opts) {
    var args = [
         'xvfb-run', '-w', '0', '-a',
        'google-chrome',
        '--proxy-server=localhost:' + opts.proxy,
        '--user-data-dir=' + opts.profileDir,
        'http://localhost:' + opts.server + '/?' + Math.random()
    ];
    var ps = spawn(args[0], args.slice(1));
    return ps;
};

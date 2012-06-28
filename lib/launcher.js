var spawn = require('child_process').spawn;
var mkdirp = require('mkdirp');

var fs = require('fs');
fs.readdir(__dirname + '/browsers').forEach(function (file) {
    if (/\.js$/.test(file)) {
    }
});

//var profileDir = '/tmp/' + Math.random().toString(16).slice(2);
var profileDir = '/tmp/02faf1b1';
mkdirp.sync(profileDir);

module.exports = function (browser, opts) {
    var uri = 'http://' + opts.server + '/?' + Math.random();
    
    var name = browser.split('/')[0];
    var version = browser.split('/')[1];
    
    var 
    var ps = spawn(args[0], args.slice(1));
    return ps;
};

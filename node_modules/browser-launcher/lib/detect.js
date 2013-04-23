var spawn = require('child_process').spawn;
var merge = require('merge');
var windows = require('./windows');
var darwin = require('./darwin');

var browsers = {
    'google-chrome' : {
        name : 'chrome',
        re : /Google Chrome (\S+)/,
        type : 'chrome',
        profile : true,
    },
    'chromium-browser' : {
        name : 'chromium',
        re : /Chromium (\S+)/,
        type : 'chrome',
        profile : true,
    },
    'firefox' : {
        name : 'firefox',
        re : /Mozilla Firefox (\S+)/,
        type : 'firefox',
        profile : true,
    },
    'phantomjs' : {
        name : 'phantom',
        re : /(\S+)/,
        type : 'phantom',
        headless : true,
        profile : true,
    },
    'safari': {
    	name: 'safari',
        type: 'safari',
        profile: false
    },
    'ie': {
        windows: true,
        name: 'ie',
        type: 'ie',
        profile: false
    }
};

var mix = function(s, r) {
    Object.keys(s).forEach(function(name) {
        if (!r.hasOwnProperty(name)) {
            r[name] = s[name];
        }
    });
    return r;
};

module.exports = function (cb) {
    var available = [],
        pending = Object.keys(browsers).length;
    Object.keys(browsers).forEach(function (name) {
        var br = browsers[name];
        check(name, function (err, v, p) {
            if (err === null) {
                if (Array.isArray(v)) {
                    v.forEach(function(item) {
                        available.push(mix(br, {
                            command : item.path,
                            version : item.version
                        }));
                    });
                } else {
                    available.push(mix(br, {
                        command : p || name,
                        version : v
                    }));
                }
            }
            if (--pending === 0) cb(available);
        });
    });
};


function checkWindows (name, cb) {
	if (windows[name]) {
	    windows[name].version(function(err, version) {
            if (version) {
               windows[name].path(function(err, p) {
                    if (err) {
                        return cb('failed to get path for ' + name);
                    }
                    cb(null, version, p);
               });
            } else {
               cb('failed to get version for ' + name);
            }
	    });
	} else {
   	    checkWhich(name, cb);
	}
};

function checkDarwin (name, cb) {
	if (darwin[name]) {
        if (darwin[name].all) {
            darwin[name].all(function(err, available) {
                if (err) {
                   cb('failed to get version for ' + name);
                } else {
                    cb(err, available);
                }
            });
        } else {
            darwin[name].version(function(err, version) {
                if (version) {
                    darwin[name].path(function(err, p) {
                        if (err) {
                            return cb('failed to get path for ' + name);
                        }
                        cb(null, version, p);
                   });
                } else {
                   cb('failed to get version for ' + name);
                }
            });
        }
	} else {
   	    checkWhich(name, cb);
	}
};

function check(name, cb) {
    switch (process.platform) {
        case 'win32':
	        checkWindows(name, cb);
            break;
        case 'darwin':
            checkDarwin(name, cb);
            break;
        default:
   	        checkWhich(name, cb);
            break;
   }
};

function checkWhich (name, cb) {
    var re = browsers[name].re;
    if (browsers[name].windows) {
	 return cb('not installed');
    }
    var ps = spawn(name, [ '--version' ]);
    var data = '';
    ps.stdout.on('data', function (buf) { data += buf });
    
    ps.on('exit', function (code, sig) {
        if (code !== 0) return cb('not installed');
        
        var m = re.exec(data);
        if (m) cb(null, m[1])
        else cb(null, data.trim())
    });
};

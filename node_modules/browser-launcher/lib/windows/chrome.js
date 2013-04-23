var exec = require('child_process').exec;
var qryVersion = 'reg query "HKEY_CURRENT_USER\\Software\\Google\\Update\\Clients" /s';
var qryPath = 'reg query "HKEY_CURRENT_USER\\Software\\Google\\Update" /v LastInstallerSuccessLaunchCmdLine';
var currentVersion;
var path = require('path');
exports.version = function(callback) {
   if (currentVersion) {
   	return callback(null, currentVersion);
   }
   exec(qryVersion, function (err, stdout) {
	var data = stdout.split('\r\n'),
	version = '', inChrome;
   	data.forEach(function(line) {
	   if (inChrome && !version) {
	       if (/pv/.test(line)) {
	    	  version = line.replace('pv', '').replace('REG_SZ', '').trim();
	       }
	   }
	   if (/Google Chrome/.test(line)) {
	       inChrome = true;
	   }
	});
	if (version) {
		currentVersion = version;
	}
   	callback(null, version);
   });
};

exports.path = function(callback) {
   exports.version(function(err, version) {
	   exec(qryPath, function (err, stdout) {
		var data = stdout.split('\r\n'),
			chromePath;
		data.forEach(function(line) {
		    if (/LastInstallerSuccessLaunchCmdLine/.test(line)) {
			var cmd = line.replace('LastInstallerSuccessLaunchCmdLine', '').replace('REG_SZ', '').replace(/"/g, '').trim();
			if (cmd) {
				chromePath = cmd;
			}
		    }
		});
		if (!chromePath && version) {
			getDefaultPath(function(err, p) {
				callback(null, p);
			});
		} else {
			callback(null, chromePath);
		}
	   });
   });
};

var defaultPath = '%HOMEPATH%\\Local Settings\\Application Data\\Google\\Chrome\\Application\\chrome.exe';
var getDefaultPath = function(callback) {
   exec('echo ' + defaultPath, function(err, stdout) {
      callback(err, stdout.replace(/"/g, '').trim());
   });
};

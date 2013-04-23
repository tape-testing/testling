var exec = require('child_process').exec;
var qryVersion = 'reg query "HKEY_LOCAL_MACHINE\\Software\\Apple Computer, Inc.\\Safari" /v Version';
var qryPath = 'reg query "HKEY_LOCAL_MACHINE\\Software\\Apple Computer, Inc.\\Safari" /v BrowserExe';


exports.version = function(callback) {
   exec(qryVersion, function (err, stdout) {
	var data = stdout.split('  '),
	version = data[data.length - 1].replace('Version', '').replace('REG_SZ', '').replace(/\t/g, '').replace(/\r\n/g, '').trim();
   	callback(null, version);
   });
};

exports.path = function(callback) {
   exec(qryPath, function (err, stdout) {
	var data = stdout.split('\r\n');
   	data.forEach(function(line) {
	    if (/BrowserExe/.test(line)) {
	    	var cmd = line.replace('BrowserExe', '').replace('REG_SZ', '').replace(/"/g, '').trim();
		if (cmd) {
   			callback(null, cmd);
		}
	    }
	});
   });
};

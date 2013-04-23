var exec = require('child_process').exec;
var qry = 'reg query "HKEY_LOCAL_MACHINE\\Software\\Microsoft\\Internet Explorer" /v Version';
var iePath = '%ProgramFiles%\\Internet Explorer\\iexplore.exe';

exports.version = function(callback) {
   exec(qry, function (err, stdout) {
	var data = stdout.split(' '),
	version = data[data.length - 1].replace('Version', '').replace('REG_SZ', '').replace(/\t/g, '').replace(/\r\n/g, '').trim();
   	callback(null, version);
   });
};

exports.path = function(callback) {
   exec('echo ' + iePath, function(err, stdout) {
      callback(err, stdout.replace(/"/g, '').trim());
   });
};


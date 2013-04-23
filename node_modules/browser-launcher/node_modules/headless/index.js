var fs = require('fs');
var spawn;

try {
  spawn = require('child-killer').spawn;
} catch(e) {
  spawn = require('child_process').spawn;
}

function findFreeServernum(servernum, callback) {
  fs.exists('/tmp/.X' + servernum + '-lock', function(exists) {
    if(exists) {
      servernum++;
      findFreeServernum(servernum, callback);
      return;
    }
    callback(servernum);
  });
}

module.exports = function headless(startnum, callback) {
  if (!callback) {
    callback = startnum;
    startnum = 99;
  }

  findFreeServernum(startnum, function(servernum) {
    var childProcess = spawn('Xvfb', [':' + servernum]);
    // assume starting Xvfb takes less than 500 ms and continue if it hasn't
    // exited during that time
    var timeout = setTimeout(function() {
      callback(null, childProcess, servernum);
    }, 500);

    // if Xvfb exits prematurely the servernum wasn't valid.
    // Happens if there's already an X-server running on @servernum but no file was created in /tmp
    childProcess.once('exit', function() {
      clearTimeout(timeout);
      servernum++;
      headless(servernum, callback);
    });
  });
}

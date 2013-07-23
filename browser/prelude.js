(function () {
    var xws = require('xhr-write-stream');
    var Stream = require('stream');
    var json = typeof JSON === 'object' ? JSON : require('jsonify');
    
    process.on = function () {};
    var ws = xws('/sock');
    ws.write(window.location.hash + '\n');
    
    function createChannel (writeListen) {
        var c = new Stream;
        c.writable = true;
        c.write = function (buf) {
            if (writeListen) writeListen(buf);
            return ws.write(String(buf));
        };
        c.destroy = function () {};
        c.end = function (buf) {
            c.emit('close');
        };
        
        return c;
    }
    
    var lastTestId = 0;
    process.stdout = createChannel(function (buf) {
        var m = /^(?:not )? ok (\d+)/.exec(String(buf));
        if (m) lastTestId = m[1];
    });
    process.stderr = createChannel();
    process.stdout.on('close', function () { ws.end() });
    process.exit = function () { ws.end() };
    
    var oldError = window.onerror;
    window.onerror = function (err, url, lineNum) {
        var type = err && err.name || 'Error';
        process.stdout.write(
            'not ok ' + (lastTestId + 1) + ' ' + type + ': '
            + (err && err.message || String(err))
            + (lineNum ? ' on line ' + lineNum : '')
            + '\n'
        );
        if (err && err.stack) {
            var lines = String(err.stack).split('\n');
            var xs = [];
            for (var i = 0; i < lines.length; i++) {
                xs.push('      ' + lines[i]);
            }
            
            process.stdout.write([
                '  ---',
                '    stack:',
                xs.join('\n'),
                '  ...'
            ].join('\n') + '\n');
        }
        ws.end();
        
        if (typeof oldError === 'function') {
            return oldError.apply(this, arguments);
        }
    };
    window.__testlingErrorHandler = onerror;
    
    if (typeof console === 'undefined') {
        console = {};
    }
    
    var originalLog = console.log;
    console.log = function (msg) {
        if('string' === typeof msg) {
          var args = arguments;
          for (var i = 1; i < args.length; i++) {
              msg = msg.replace(/(^|[^%])%[sd]/, function (_, s) {
                  return s + args[i];
              });
          }
        } else {
          msg = [].map.call(arguments, function (v) {
            return JSON.stringify(v, null, 2)
          })
        }

        process.stdout.write(msg + '\n');
        if (typeof originalLog === 'function') {
            return originalLog.apply(this, arguments);
        }
        else if (originalLog) return originalLog(arguments[0]);
    };
    
    window.__testlingConsole = console;
})();

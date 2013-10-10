var xws = require('xhr-write-stream');
var Stream = require('stream');
var json = typeof JSON === 'object' ? JSON : require('jsonify');
var inspect = require('object-inspect');

process.on = function () {};
var ws = xws('/__testling/sock');
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

var params = (function () {
    var unesc = typeof decodeURIComponent !== 'undefined'
        ? decodeURIComponent : unescape
    ;
    var parts = (window.location.search || '').replace(/^\?/, '').split('&');
    var opts = {};
    for (var i = 0; i < parts.length; i++) {
        var x = parts[i].split('=');
        opts[unesc(x[0])] = unesc(x[1]);
    }
    return opts;
})();

var originalLog = console.log;
console.log = function (msg) {
    var index = 1;
    var args = arguments;
    
    if (typeof msg === 'string') {
        msg = msg.replace(/(^|[^%])%[sd]/g, function (_, s) {
            return s + args[index++];
        });
    }
    else msg = inspect(msg);
    
    for (var i = index; i < args.length; i++) {
        msg += ' ' + inspect(args[i]);
    }
    
    if (params.show === undefined || parseBoolean(params.show)) {
        var elem = document.getElementById('__testling_output');
        if (elem) {
            var txt = document.createTextNode(msg + '\n');
            elem.appendChild(txt);
        }
    }
    process.stdout.write(msg + '\n');
    
    if (typeof originalLog === 'function') {
        return originalLog.apply(this, arguments);
    }
    else if (originalLog) return originalLog(arguments[0]);
};

window.__testlingConsole = console;

function parseBoolean (x) {
    if (x === 'false' || x === '0') return false;
    return true;
}

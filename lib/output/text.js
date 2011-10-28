var wordwrap = require('wordwrap');

module.exports = function () {
    var handler = new Handler;
    
    return function (name, res) {
        if (handler[name]) {
            handler[name](res);
        }
        else {
            console.error('\r\nUnknown event: ' + name);
        }
    };
};

function stringify (obj) {
    return JSON.stringify(obj);
}

function Handler () {
    this.counts = {};
    this.fails = {};
}

Handler.prototype.testBegin = function () {};
Handler.prototype.testEnd = function () {};

Handler.prototype.log = function (res) {
    this.fails[res.browser].push([ 'log', res ]);
};

Handler.prototype.visit = function (key) {
    this.fails[key] = [];
    this.write('\r' + key + '    ');
};

Handler.prototype.launched = function (key) {    
    this.fails[key] = [];
    this.writeBrowser(key);
};

Handler.prototype.assert = function (res) {
    var key = res.browser;
    var id = res.testId || 'init';
    
    var counts = this.counts;
    var fails = this.fails;
    
    if (!counts[key]) counts[key] = { inits : { pass : 0, fail : 0 } };
    if (!counts[key][id]) counts[key][id] = { pass : 0, fail : 0 };
    var count = counts[key][id];
    
    if (res.ok) count.pass ++;
    else {
        count.fail ++;
        fails[key].push([ 'assert', res ]);
    }
    if (count.plan) this.writeBrowser(key);
};

Handler.prototype.plan = function (res) {
    var key = res.browser;
    var id = res.testId || 'init';
    var counts = this.counts;
    
    if (key) {
        if (!counts[key]) counts[key] = { inits : { pass : 0, fail : 0 } };
        if (!counts[key][id]) counts[key][id] = { pass : 0, fail : 0 };
        var count = counts[key][id];
        
        if (res.n) count.plan = res.n;
    }
};

Handler.prototype.end = function (res) {
    var key = res.browser;
    var id = res.testId || 'init';
    
    this.writeBrowser(key);
    this.write('\r\n');
    
    this.fails[key].forEach(function (fail) {
        console.dir(fail);
    });
};

Handler.prototype.finished = function () {
    var self = this;
    var total = { pass : 0, fail : 0 };
    var counts = this.counts;
    
    Object.keys(counts).forEach(function (key) {
        Object.keys(counts[key]).forEach(function (id) {
            total.pass += counts[key][id].pass;
            total.fail += counts[key][id].fail;
        });
    });
    
    counts.total = { total : total };
    
    this.write('\r\n');
    this.writeBrowser('total');
    
    process.nextTick(function () {
        self.write('\r\n');
    });
};

Handler.prototype.error = function (res) {
    if (res.browser && this.fails[res.browser]) {
        if (counts[res.browser]) {
            counts[res.browser][res.testId || 'init'].fail ++;
        }
        this.fails[res.browser].push([ 'error', res ]);
    }
    else {
        this.write([
            '',
            'Unexpected error: ' + JSON.stringify(res),
            '',
            ''
        ].join('\r\n'));
    }
};

Handler.prototype.write = function (msg) {
    process.stdout.write(msg);
};

Handler.prototype.writeBrowser = function (key) {
    var counts = this.counts;
    var fails = this.fails;
    
    if (!counts[key]) counts[key] = { init : { pass : 0, fail : 0 } };
    
    var count = Object.keys(counts[key]).reduce(function (acc, id) {
        acc.pass += counts[key][id].pass;
        acc.fail += counts[key][id].fail;
        return acc;
    }, { pass : 0, fail : 0 });
    
    var percent = count.pass + count.fail <= 0
        ? '0'
        : Math.floor(100 * count.pass / (count.pass + count.fail))
    ;
    
    function padRight (n, s) {
        s = s.toString();
        return s + Array(Math.max(0, n + 1 - s.length)).join(' ');
    }
    
    function padLeft (n, s) {
        s = s.toString();
        return Array(Math.max(0, n - s.length) + 1).join(' ') + s;
    }
    
    this.write('\r'
        + padRight(12, key)
        + '  '
        + padLeft(9, count.pass + '/' + (count.pass + count.fail))
        + '  '
        + padLeft(3, percent) + ' % ok'
    );
};

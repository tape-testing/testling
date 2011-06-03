var EventEmitter = require('events').EventEmitter;
var traverse = require('traverse');

var Test = module.exports = function (name, frameTarget) {
    this.name = name;
    this.windows = [];
    this.running = true;
    this.count = 0;
    this.frameTarget = frameTarget;
};

Test.prototype = new EventEmitter;

Test.prototype.createWindow = function (href, cb) {
    if (typeof href === 'function') {
        cb = href;
        href = null;
    }
    
    var frame = $('<iframe>')
        .addClass('viewport')
        .attr('src', href || 'about:blank')
        .appendTo(this.frameTarget)
    ;
    
    var win = window[window.length - 1];
    this.windows.push(win);
    if (cb) {
        var fn = function () {
            process.nextTick(function () {
                cb(win)
            });
        };
        
        $(win).load(fn);
    }
    
    this.emit('window', win);
    this.emit('frame', frame);
    
    return win;
};

Test.prototype.plan = function (n) {
    this.planned = (this.planned || 0) + n;
    this.emit('plan', n);
};

Test.prototype.end = function () {
    if (this.running) {
        this.running = false;
        this.emit('end');
    }
};

Test.prototype.fail = function (desc) {
    if (!this.running) this.emit('fail() called after test ended');
    this.emit('fail', null, null, new Error(desc));
};

Test.prototype.ok = function (cond, desc) {
    this.equal(Boolean(cond), true, desc);
};

Test.prototype.equal = function (x, y, desc) {
    this.count ++;
    if (this.planned && this.count > this.planned) {
        this.emit('fail', 'more tests run than planned');
    }
    else if (!this.running) {
        this.emit('fail', 'equal() called after test ended');
    }
    else if (x == y) this.emit('ok', 'equal', x, y, desc);
    else this.emit('fail', 'equal', x, y, desc);
    
    if (this.planned && this.count === this.planned) this.end();
};

Test.prototype.notDeepEqual = function (x, y, desc) {
    this.count ++;
    if (this.planned && this.count > this.planned) {
        this.emit('fail', 'more tests run than planned');
    }
    else if (!this.running) {
        this.emit('fail', 'notDeepEqual() called after test ended');
    }
    else if (!traverse.deepEqual(x, y)) {
        this.emit('ok', 'notDeepEqual', x, y, desc);
    }
    else {
        this.emit('fail', 'notDeepEqual', x, y, desc);
    }
    
    if (this.planned && this.count === this.planned) this.end();
};

Test.prototype.deepEqual = function (x, y, desc) {
    this.count ++;
    if (this.planned && this.count > this.planned) {
        this.emit('fail', 'more tests run than planned');
    }
    else if (!this.running) {
        this.emit('fail', 'deepEqual() called after test ended');
    }
    else if (traverse.deepEqual(x, y)) {
        this.emit('ok', 'deepEqual', x, y, desc);
    }
    else {
        this.emit('fail', 'deepEqual', x, y, desc);
    }
    
    if (this.planned && this.count === this.planned) this.end();
};

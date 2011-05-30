var EventEmitter = require('events').EventEmitter;

var Test = module.exports = function (name) {
    this.name = name;
    this.windows = [];
    this.running = true;
};

Test.prototype = new EventEmitter;

Test.prototype.createWindow = function (href, cb) {
    if (typeof href === 'function') {
        cb = href;
        href = null;
    }
    
    $('<iframe>')
        .addClass('viewport')
        .attr('src', href || 'about:blank')
        .appendTo($('#tests'))
    ;
    var win = window[window.length - 1];
    this.windows.push(win);
    
    if (cb) process.nextTick(function () {
        $(win).ready(function () {
            cb(win)
        });
    });
    return win;
};

Test.prototype.end = function () {
    this.running = false;
    this.emit('end');
};
    
Test.prototype.fail = function (desc) {
    if (this.running) this.emit('fail() called after test ended');
    this.emit('fail', new Error(desc));
};

Test.prototype.ok = function (cond, desc) {
    this.equal(cond, true, desc);
};

Test.prototype.equal = function (x, y, desc) {
    if (this.running) {
        this.emit('fail', 'equal() called after test ended');
    }
    else if (x == y) this.emit('ok', x, y, desc);
    else this.emit('fail', x, y, desc);
};

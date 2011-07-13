var EventEmitter = require('events').EventEmitter;
var traverse = require('traverse');
var jquery = require('jquery');

var Test = module.exports = function (frameTarget) {
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
                cb(win, function (x) {
                    return arguments.length === 1
                        ? jquery(x, win.document)
                        : jquery.apply(null, arguments)
                    ;
                })
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

Test.prototype.fail = function (err) {
    if (!this.running) {
        this.emit('fail', {
            message : 'fail() called after test ended'
        })
    }
    else this.emit('fail', err)
};

Test.prototype.ok = function (cond, desc) {
    this.equal(Boolean(cond), true, desc);
};

Test.prototype.equal = function (x, y, desc) {
    this.count ++;
    if (this.planned && this.count > this.planned) {
        this.emit('fail', {
            message : 'more tests run than planned'
        });
    }
    else if (!this.running) {
        this.emit('fail', {
            message : 'equal() called after test ended'
        });
    }
    else if (x == y) this.emit('ok', 'equal', x, y, desc);
    else this.emit('fail', {
        message : JSON.stringify(x) + ' != ' + JSON.stringify(y)
    });
    
    if (this.planned && this.count === this.planned) this.end();
};

Test.prototype.notDeepEqual = function (x, y, desc) {
    this.count ++;
    if (this.planned && this.count > this.planned) {
        this.emit('fail', {
            message : 'more tests run than planned'
        });
    }
    else if (!this.running) {
        this.emit('fail', {
            message : 'notDeepEqual() called after test ended'
        });
    }
    else if (!traverse.deepEqual(x, y)) {
        this.emit('ok', {
            message : JSON.stringify(x) + ' notDeepEqual ' + JSON.stringify(y),
            desc : desc
        });
    }
    else {
        this.emit('fail', {
            message : JSON.stringify(x) + ' notDeepEqual ' + JSON.stringify(y),
            desc : desc
        });
    }
    
    if (this.planned && this.count === this.planned) this.end();
};

Test.prototype.deepEqual = function (x, y, desc) {
    this.count ++;
    if (this.planned && this.count > this.planned) {
        this.emit('fail', {
            message : 'more tests run than planned',
            desc : desc
        });
    }
    else if (!this.running) {
        this.emit('fail', {
            message : 'deepEqual() called after test ended'
        });
    }
    else if (traverse.deepEqual(x, y)) {
        this.emit('ok', {
            message : JSON.stringify(x) + ' deepEqual ' + JSON.stringify(y),
            desc : desc
        });
    }
    else {
        this.emit('fail', {
            message : JSON.stringify(x) + ' deepEqual ' + JSON.stringify(y),
            desc : desc
        });
    }
    
    if (this.planned && this.count === this.planned) this.end();
};

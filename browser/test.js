var $ = require('jquery');
var jadeify = require('jadeify');
var EventEmitter = require('events').EventEmitter;

var traverse = require('traverse');
var stackedy = require('stackedy');

var TestHandle = require('./test_handle');
var testFiles = (require)('test_files');

var Test = module.exports = function (name) {
    if (!(this instanceof Test)) return new Test(name);
    
    var self = this;
    self.name = name;
    self.running = false;
    
    var source = self.source = testFiles[name];
    self.stackedy = stackedy(source, { filename : name });
    
    var box = self.box = jadeify('test.jade', {
        name : name,
        progress : jadeify('progress.jade'),
        ok : 0,
        fail : 0,
    });
    
    box.ready(function () {
        box.find('.title .refresh')
            .mouseover(function () {
                $(this).attr('src', 'images/refresh_hover.png');
            })
            .mouseout(function () {
                $(this).attr('src', 'images/refresh.png');
            })
            .click(function (ev) {
                ev.stopPropagation();
                self.reload();
            })
        ;
    });
};

Test.prototype = new EventEmitter;

Test.all = function () {
    return Object.keys(testFiles)
        .map(function (name) {
            return new Test(name);
        })
    ;
};

Test.prototype.fail = function (fail) {
    this.box
        .removeClass('ok')
        .addClass('fail')
    ;
    
    var arrow = this.box.find('.title .arrow');
    arrow.attr('src',
        arrow.attr('src').replace(/(down|up)\.png/, '$1_fail.png')
    );
    
    this.box.vars.fail ++;
};

Test.prototype.pass = function (ok) {
    this.box
        .removeClass('ok')
        .addClass('fail')
    ;
    this.box.vars.ok ++;
};

Test.prototype.run = function (context) {
    var self = this;
    self.running = true;
    
    if (!context) context = {};
    if (!context.require) context.require = require;
    
    var box = self.box;
    var handle = self.handle = new TestHandle;
    
    handle.on('ok', function () {
        self.pass();
    });
    
    handle.on('fail', function () {
        self.fail();
    });
    
    return self.stackedy
        .run(context)
        .on('error', function (s) {
            console.dir(s);
            self.fail();
        })
    ;
};

Test.prototype.stop = function () {
    if (this.running) {
        this.stackedy.stop();
        this.stackedy.removeAllListeners('error');
        this.emit('end');
        this.running = false;
    }
    return this;
};

Test.prototype.reset = function () {
    this.box
        .removeClass('ok')
        .removeClass('fail')
        .removeClass('all')
    ;
    this.stop();
    return this;
};

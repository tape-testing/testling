var $ = require('jquery');
var jadeify = require('jadeify');
var EventEmitter = require('events').EventEmitter;

var traverse = require('traverse');
var progressify = require('progressify');

var Handle = require('./handle');
var testFiles = (require)('test_files');

var Fn = module.exports = function (file, name, fn) {
    if (!(this instanceof Fn)) return new Fn(name, fn);
    var self = this;
    
    self.file = file;
    self.name = name;
    self.fn = fn;
    
    self.progress = progressify({ mount : '.' });
    
    self.element = jadeify('box/fn.jade', {
        name : name,
        progress : self.progress.element,
    });
    
    self.element.first('.title').toggle(
        function () {
            self.element.find('.more').slideDown(200);
        },
        function () {
            self.element.find('.more').slideUp(200);
        }
    );
    
    var h = self.handle = new Handle({
        stackedy : self.file.running,
        frameTarget : null
    });
    
    h.on('plan', function (n) {
        self.emit('plan', n);
    });
    
    h.on('end', function () {
        self.emit('end');
    });
    
    h.on('fail', function (fail) {
        self.fail(fail);
    });
    
    h.on('ok', function (ok) {
        self.ok(ok);
    });
};

Fn.prototype = new EventEmitter;

Fn.prototype.run = function () {
    this.fn(this.handle);
    return this;
};

Fn.prototype.appendTo = function () {
    this.element.appendTo.apply(this.element, arguments);
    return this;
};

Fn.prototype.fail = function (err) {
    this.element
        .removeClass('ok')
        .addClass('fail')
    ;
    
    var elem = jadeify('assert/fail.jade', {
        err : err,
        lines : testFiles[this.file.name].split('\n')
    }).appendTo(this.element.find('.more .asserts'));
    
    var lines = elem.find('.lines');
    
    var start = err.current
        ? err.current.start
        : err.stack[0].start
    ;
    
    var line = $(lines.find('.line').get(start.line - 1));
    line.addClass('selected');
    
    elem.find('.overview').click(function (ev) {
        ev.stopPropagation();
        
        if (lines.is(':hidden')) {
            lines.slideDown(200, function () {
                var pos = line.offset();
                if (pos) {
                    var jump = pos.top - lines.offset().top;
                    lines.scrollTop(jump - lines.height() / 2);
                }
            });
        }
        else {
            lines.slideUp(200);
        }
    });
    
    var arrow = this.element.find('.title .arrow');
    arrow.attr(
        'src',
        arrow.attr('src').replace(/(down|up)\.png/, '$1_fail.png')
    );
    
    this.element.find('.fail-count').text(
        parseInt(this.element.find('.fail-count').text(), 10) + 1
    );
};

Fn.prototype.ok = function (ok) {
    this.element.addClass('ok');
    
    jadeify('assert/ok.jade', {
        message : ok.message || '',
        desc : ok.desc || ''
    }).appendTo(this.element.find('.more .asserts'));
    
    this.element.find('.ok-count').text(
        parseInt(this.element.find('.ok-count').text(), 10) + 1
    );
};

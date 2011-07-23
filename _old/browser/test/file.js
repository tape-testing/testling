var $ = require('jquery');
var jadeify = require('jadeify');
var EventEmitter = require('events').EventEmitter;

var traverse = require('traverse');
var stackedy = require('stackedy');
var burrito = require('burrito');
var progressify = require('progressify');

var Fn = require('./fn');
var testFiles = (require)('test_files');

var File = module.exports = function (name) {
    if (!(this instanceof File)) return new File(name);
    
    var self = this;
    
    self.name = name;
    self.running = false;
    
    self.names = {};
    self.names.exporter = burrito.generateName(6);
    
    var source = self.source =
        'var module = { exports : {} }; var exports = module.exports;\n'
        + testFiles[name]
        + '\n' + self.names.exporter + '(module)'
    ;
    
    self.stackedy = stackedy(source, { filename : name });
    
    self.progress = progressify({ mount : '.' });
    
    var box = self.box = jadeify('box/file.jade', {
        name : name,
        progress : self.progress.element
    });
    
    self.once('end', function () {
        box.find('.button')
            .unbind('click')
            .click(function () {
                self.reset();
                self.run();
            })
            .attr('src', 'images/refresh.png')
        ;
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
                self.reset();
                self.run();
            })
        ;
        
        box.find('.button').click(function (ev) {
            ev.stopPropagation();
            self.run();
        });
        
        var more = box.find('.more');
        var arrow = box.find('.title .arrow');
        box.find('.title:first').toggle(
            function () {
                more.slideDown(200, function () {
                    arrow.attr('src', arrow.attr('src')
                        .replace(/down((?:_fail)?\.png)$/, 'up$1')
                    );
                });
            },
            function () {
                more.slideUp(200, function () {
                    arrow.attr('src', arrow.attr('src')
                        .replace(/up((?:_fail)?\.png)$/, 'down$1')
                    );
                });
            }
        );
    });
};

File.prototype = new EventEmitter;

File.all = function () {
    return Object.keys(testFiles)
        .map(function (name) {
            return new File(name);
        })
    ;
};

File.prototype.fail = function (err) {
    this.box
        .removeClass('ok')
        .addClass('fail')
    ;
    
    this.box.find('.fail-count').text(
        parseInt(this.box.find('.fail-count').text(), 10) + 1
    );
    
    var arrow = this.box.find('.title .arrow');
    arrow.attr(
        'src',
        arrow.attr('src').replace(/(down|up)\.png/, '$1_fail.png')
    );
    
    if (err) {
        var elem = jadeify('assert/fail.jade', {
            err : err,
            lines : testFiles[this.name].split('\n')
        });
        
        var fn = err.stack[0];
        if (fn) {
            elem.appendTo(fn.element.find('.more .asserts'));
        }
        else {
            elem.appendTo(this.box.find('.more .asserts:first'));
        }
        
        var div = elem.find('.lines');
        var start = err.current.start;
        
        var line = $(div.find('.line').get(start.line - 1));
        line.addClass('selected');
        
        elem.find('.overview').click(function (ev) {
            ev.stopPropagation();
            
            if (div.is(':hidden')) {
                div.slideDown(200, function () {
                    if (line.offset()) {
                        var jump = line.offset().top - div.offset().top;
                        div.scrollTop(jump - div.height() / 2);
                    }
                });
            }
            else {
                div.slideUp(200);
            }
        });
    }
};

File.prototype.ok = function (ok) {
    this.box.addClass('ok');
    this.box.find('.ok-count').text(
        parseInt(this.box.find('.ok-count').text(), 10) + 1
    );
};

File.prototype.run = function (context) {
    var self = this;
    if (self.running) return self;
    
    if (!context) context = {};
    if (!context.require) context.require = require;
    
    context[self.names.exporter] = function (module) {
        if (typeof module !== 'object') {
            self.fail({
                message : 'module is not an object'
            });
        }
        else if (typeof module.exports !== 'object') {
            self.fail({
                message : 'module.exports is not an object'
            });
        }
        else {
            var tests = {};
            Object.keys(module.exports).forEach(function (name) {
                var fn = module.exports[name];
                if (typeof fn !== 'function') return;
                
                var t = tests[name] = new Fn(self, name, fn);
                t.appendTo(box.find('.more .functions'));
            });
            
            Object.keys(tests).forEach(function (name) {
                self.running.stack.unshift(tests[name]);
                tests[name].run();
                self.running.stack.shift();
            });
        }
    };
    
    var box = self.box;
    box.find('.button')
        .unbind('click')
        .click(function (ev) {
            ev.stopPropagation();
            self.stop();
        })
        .one('load', function () {
            self.running = self.stackedy.run(context);
            self.running.on('error', function (err) {
                self.fail(err);
            });
        })
        .attr('src', 'images/stop.png')
    ;
    
    return self;
};

File.prototype.stop = function () {
    var self = this;
    
    self.box.find('.button')
        .unbind('click')
        .click(function (ev) {
            ev.stopPropagation();
            self.reset();
            self.run();
        })
        .one('load', function () {
            if (self.running) {
                self.running.stop();
                self.running.removeAllListeners('error');
                self.running = null;
                self.emit('end');
            }
        })
        .attr('src', 'images/refresh.png')
    ;
    return self;
};

File.prototype.reset = function () {
    this.box
        .removeClass('ok')
        .removeClass('fail')
        .removeClass('all')
    ;
    this.box.find('.button').attr('src', 'images/play.png');
    this.box.find('.functions').empty();
    
    this.box.find('.fail-count').text(0);
    this.box.find('.ok-count').text(0);
    
    var arrow = this.box.find('.title .arrow');
    arrow.attr(
        'src',
        arrow.attr('src').replace(/(down|up)_fail\.png/, '$1.png')
    );
    
    this.stop();
    return this;
};

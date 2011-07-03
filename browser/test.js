var $ = require('jquery');
var jadeify = require('jadeify');
var EventEmitter = require('events').EventEmitter;

var traverse = require('traverse');
var stackedy = require('stackedy');
var burrito = require('burrito');

var TestHandle = require('./test_handle');
var testFiles = (require)('test_files');

var Test = module.exports = function (name) {
    if (!(this instanceof Test)) return new Test(name);
    
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
    
    var box = self.box = jadeify('box.jade', {
        name : name,
        progress : jadeify('progress.jade'),
        ok : 0,
        fail : 0,
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
        box.find('.title').toggle(
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

Test.prototype = new EventEmitter;

Test.all = function () {
    return Object.keys(testFiles)
        .map(function (name) {
            return new Test(name);
        })
    ;
};

Test.prototype.fail = function (err) {
    this.box
        .removeClass('ok')
        .addClass('fail')
    ;
    
    var elem = jadeify('assert/fail.jade', {
        err : err,
        lines : testFiles[this.name].split('\n'),
    }).appendTo(this.box.find('.more .asserts'));
    
    var div = elem.find('.lines');
    var start = err.current.start;
    
    elem.toggle(
        function () {
            elem.find('.lines').slideDown(200, function () {
                var pos = $(div.find('div').get(start.line - 1)).offset();
                console.log(pos.left + ',' + pos.top);
                div.scrollTop(pos.top);
            });
        },
        function () {
            elem.find('.lines').slideUp(200);
        }
    );
    
    var arrow = this.box.find('.title .arrow');
    arrow.attr(
        'src',
        arrow.attr('src').replace(/(down|up)\.png/, '$1_fail.png')
    );
    
    this.box.vars.fail ++;
};

Test.prototype.pass = function (ok) {
    this.box
        .removeClass('ok')
        .addClass('fail')
    ;
    
    jadeify('assert/ok.jade', {
        cmp : ok.cmp || '',
        desc : ok.desc || ''
    }).appendTo(this.box.find('.more .asserts'));
    
    this.box.vars.ok ++;
};

Test.prototype.run = function (context) {
    var self = this;
    if (self.running) return self;
    
    if (!context) context = {};
    if (!context.require) context.require = require;
    
    context[self.names.exporter] = function (module) {
        if (typeof module !== 'object') {
            self.fail('module is not an object');
        }
        else if (typeof module.exports !== 'object') {
            self.fail('module.exports is not an object');
        }
        else {
            Object.keys(exports).forEach(function (key) {
                var fn = exports[key];
                fn(handle);
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
            var handle = self.handle = new TestHandle;
            
            handle.on('ok', function () {
                self.pass();
            });
            
            handle.on('fail', function () {
                self.fail();
            });
            
            self.running = self.stackedy.run(context);
            self.running.on('error', function (err) {
                self.fail(err);
            });
        })
        .attr('src', 'images/stop.png')
    ;
    
    return self;
};

Test.prototype.stop = function () {
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

Test.prototype.reset = function () {
    this.box
        .removeClass('ok')
        .removeClass('fail')
        .removeClass('all')
    ;
    this.box.find('.button').attr('src', 'images/play.png');
    this.box.find('.asserts').empty();
    
    this.box.vars.fail = 0;
    this.box.vars.ok = 0;
    
    var arrow = this.box.find('.title .arrow');
    arrow.attr(
        'src',
        arrow.attr('src').replace(/(down|up)_fail\.png/, '$1.png')
    );
    
    this.stop();
    return this;
};

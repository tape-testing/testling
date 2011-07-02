var $ = require('jquery');
var jadeify = require('jadeify');
var TestHandle = require('./test_handle');
var traverse = require('traverse');
var stackedy = require('stackedy');
var testFiles = (require)('test_files');

var Test = module.exports = function (name) {
    if (!(this instanceof Test)) return new Test(name);
    
    var self = this;
    self.name = name;
    
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
}

Test.all = function () {
    return Object.keys(testFiles)
        .map(function (name) {
            return new Test(name);
        })
    ;
};

Test.prototype.run = function (context) {
    var self = this;
    if (!context) context = {};
    if (!context.require) context.require = require;
    
    var box = self.box;
    var handle = self.handle = new TestHandle;
    
    handle.on('ok', function () {
        self.box.vars.ok ++;
    });
    
    handle.on('fail', function () {
        self.box.vars.fail ++;
    });
    
    return self.stackedy
        .run(context)
        .on('error', function (s) {
            console.dir(s);
            self.box.vars.fail ++;
        })
    ;
};

Test.prototype.stop = function () {
    this.stackedy.stop();
    self.stackedy.removeAllListeners('error');
};

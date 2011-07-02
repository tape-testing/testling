var $ = require('jquery');
var jadeify = require('jadeify');
var TestHandle = require('./test_handle');
var traverse = require('traverse');
var stackedy = require('stackedy');

var Test = module.exports = function (name) {
    var self = this;
    self.source = require.modules['/_tests/' + name + '.js'].toString();
    self.stackedy = stackedy(source, { filename : name + '.js' });
    
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
    return Object.keys(require.modules)
        .map(function (key) {
            var m = key.match(/^\/tests\/[^\/]+$/);
            return m && m[1];
        })
        .filter(Boolean)
        .map(function (key) {
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
    
    return self.stackedy.run(context);
};

Test.prototype.stop = function () {
    this.stackedy.stop();
};

var $ = require('jquery-browserify');
var dnode = require('dnode');
var jadeify = require('jadeify');
var Test = require('./test');

$(window).ready(function () {
    var total = jadeify('test.jade', {
        name : 'total',
        ok : 0,
        fail : 0,
    }).appendTo($('#tests'));
    
    Object.keys(require.modules)
        .filter(function (key) {
            return key.match(/^_tests\//);
        })
        .forEach(function (key) {
            var test = require(key);
            var file = key
                .replace(/^_tests\//, '')
                .replace(/(.js)?$/, '.js')
            ;
            
            Object.keys(test).forEach(function (name) {
                var box = jadeify('test.jade', {
                    name : file + ' : ' + name,
                    ok : 0,
                    fail : 0,
                }).appendTo($('#tests'));
                
                var t = new Test(name, box.find('.frames'));
                
                t.on('ok', function () {
                    box.vars.ok ++;
                });
                
                t.on('fail', function () {
                    box.vars.fail ++;
                });
                
                test[name](t);
            });
        })
    ;
});

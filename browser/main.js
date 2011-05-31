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
                var arrow = box.find('div.title img');
                var tArrow = total.find('div.title img');
                
                t.on('ok', function () {
                    box.vars.ok ++;
                    total.vars.ok ++;
                });
                
                t.on('fail', function () {
                    box.addClass('failed');
                    box.vars.fail ++;
                    
                    [ arrow, tArrow ].forEach(function (elem) {
                        var m = elem.attr('src')
                            .match(/(.+\/(?:up|down))\.png/);
                        if (m) elem.attr('src', m[1] + '_fail.png');
                    });
                    
                    if (!total.hasClass('failed')) total.addClass('failed');
                    total.vars.fail ++;
                });
                
                test[name](t);
            });
        })
    ;
});

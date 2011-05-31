var $ = require('jquery-browserify');
var dnode = require('dnode');
var jadeify = require('jadeify');
var Test = require('./test');

function createTestElement (name) {
    var box = jadeify('test.jade', {
        name : 'total',
        ok : 0,
        fail : 0,
    }).appendTo($('#tests'));
    box.find('.title').addClass('ok');
    
    function toggleImage () {
        var im = box.find('.title img');
        im.attr('src', im.attr('src').replace(
            /\/(up|down)/,
            function (_, x) {
                return '/' + { up : 'down', down : 'up' }[x]
            }
        ));
    }
    
    box.toggle(
        function () {
            $(this).find('.asserts').slideDown(200, toggleImage);
        },
        function () {
            $(this).find('.asserts').slideUp(200, toggleImage);
        }
    );
    
    return box;
}

$(window).ready(function () {
    var total = createTestElement('total');
    
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
                var box = createTestElement(file + ' : ' + name);
                
                var t = new Test(name, box.find('.frames'));
                var arrow = box.find('div.title img');
                var tArrow = total.find('div.title img');
                
                t.on('ok', function (cmp, first, second, desc) {
                    box.vars.ok ++;
                    total.vars.ok ++;
                    
                    var ok = jadeify('assert.jade', {
                        cmp : cmp,
                        first : JSON.stringify(first),
                        second : JSON.stringify(second),
                        desc : desc,
                        class : 'ok'
                    });
                    
                    box.find('.asserts').append(ok);
                    total.find('.asserts').append(ok.clone());
                });
                
                t.on('fail', function (cmp, first, second, desc) {
                    box.find('.title').removeClass('ok').addClass('fail');
                    box.vars.fail ++;
                    
                    [ arrow, tArrow ].forEach(function (elem) {
                        var m = elem.attr('src')
                            .match(/(.+\/(?:up|down))\.png/);
                        if (m) elem.attr('src', m[1] + '_fail.png');
                    });
                    
                    total.find('.title').removeClass('ok').addClass('fail');
                    total.vars.fail ++;
                    
                    var fail = jadeify('assert.jade', {
                        cmp : cmp,
                        first : JSON.stringify(first),
                        second : JSON.stringify(second),
                        desc : desc,
                        class : 'fail'
                    });
                    
                    box.find('.asserts').append(fail);
                    total.find('.asserts').append(fail.clone());
                });
                
                test[name](t);
            });
        })
    ;
});

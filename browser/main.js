var $ = require('jquery');
var jadeify = require('jadeify');
var Test = require('./test');
var traverse = require('traverse');

function stringify (obj) {
    return JSON.stringify(traverse(obj).map(function () {
        if (this.circular) this.update('[ Circular ]')
    }));
}

var total = null;

function createTestElement (name) {
    var box = jadeify('test.jade', {
        name : name,
        progress : jadeify('progress.jade')[0].outerHTML,
        ok : 0,
        fail : 0,
    }).appendTo($('#tests'));
    
    var progress = box.find('.progress');
    var pWidth = progress.width();
    var pHeight = progress.height();
    
    progress.ready(function () {
        progress.find('.finished img').width(pWidth).height(pHeight);
        progress.find('.remaining img').width(pWidth).height(pHeight);
        progress.find('.percent').width(pWidth);
    });
    
    box.complete = function (p) {
        if (box !== total) {
            var ran = 0, planned = 0;
            total.tests.forEach(function (t) {
                ran += t.count;
                if (!t.running) {
                    planned += t.count;
                }
                else if (t.planned) {
                    planned += t.planned;
                }
                else {
                    planned = undefined;
                }
            });
            
            if (planned) total.complete(ran / planned);
        }
        
        progress.find('.finished').width(
            Math.min(pWidth, Math.floor(p * pWidth))
        );
        progress.find('.percent').text(
            Math.min(100, Math.floor(p * 100)) + ' %'
        );
    };
    
    function toggleImage () {
        var im = box.find('.title img.arrow');
        im.attr('src', im.attr('src').replace(
            /\/(up|down)/,
            function (_, x) {
                return '/' + { up : 'down', down : 'up' }[x]
            }
        ));
    }
    
    box.find('.title').addClass('ok').toggle(
        function () {
            $(this).next('.more').slideDown(200, toggleImage);
        },
        function () {
            $(this).next('.more').slideUp(200, toggleImage);
        }
    );
    
    return box;
}

$(window).ready(function () {
    total = createTestElement('total');
    total.tests = [];
    
    var running = {};
    
    Object.keys(require.modules)
        .filter(function (key) {
            return key.match(/^_tests\/[^\/]+$/);
        })
        .forEach(function (key) {
            var test = require(key);
            var file = key
                .replace(/^_tests\//, '')
                .replace(/(.js)?$/, '.js')
            ;
            
            running[key] = Object.keys(test);
            
            Object.keys(test).forEach(function (name) {
                var box = createTestElement(file + ' : ' + name);
                
                var t = new Test(name, box.find('div .frames'));
                total.tests.push(t);
                
                var arrow = box.find('div.title img.arrow');
                var tArrow = total.find('div.title img.arrow');
                
                t.on('frame', function (frame) {
                    frame.width($(window).width() - 100);
                    
                    var dims = {
                        width : frame.width(),
                        height : frame.height(),
                    };
                    
                    $(window).resize(function () {
                        frame.width($(window).width() - 100);
                    });
                    
                    var prevTop = null;
                    var toggleLink = $('<a>')
                        .text('expand')
                        .attr('href', '#')
                        .toggle(
                            function (ev) {
                                ev.preventDefault();
                                
                                $(this).text('collapse');
                                
                                prevTop = $('body').scrollTop();
                                var pos = toggleLink.position();
                                $('body').animate({
                                    scrollTop : pos.top
                                }, 200);
                                
                                frame.animate(
                                    {
                                        width : $(window).width() - 100,
                                        height : $(window).height() - 50,
                                    },
                                    200,
                                    function () {
                                        $('body').scrollTop(pos.top);
                                    }
                                );
                            },
                            function (ev) {
                                ev.preventDefault();
                                
                                $(this).text('expand');
                                
                                $('body').animate({
                                    scrollTop : prevTop
                                }, 200);
                                
                                frame.animate(
                                    {
                                        width : dims.width,
                                        height : dims.height,
                                    },
                                    200,
                                    function () {
                                        $('body').scrollTop(prevTop);
                                    }
                                );
                            }
                        )
                    ;
                    
                    var fbar = jadeify('framebar.jade')
                        .prependTo(box.find('.frames'))
                    ;
                    toggleLink.appendTo(fbar.find('.toggleLink'));
                });
                
                t.on('ok', function (cmp, first, second, desc) {
                    box.vars.ok ++;
                    total.vars.ok ++;
                    
                    var ok = jadeify('assert.jade', {
                        cmp : cmp,
                        first : stringify(first),
                        second : stringify(second),
                        desc : desc,
                        class : 'ok'
                    });
                    
                    box.find('.more .asserts').append(ok);
                    total.find('.more .asserts').append(ok.clone());
                    
                    if (t.planned) box.complete(t.count / t.planned);
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
                        first : stringify(first),
                        second : stringify(second),
                        desc : desc,
                        class : 'fail'
                    });
                    
                    box.find('.more .asserts').append(fail);
                    total.find('.more .asserts').append(fail.clone());
                    
                    if (t.planned) box.complete(t.count / t.planned);
                });
                
                t.on('end', function () {
                    running[key].splice(running[key].indexOf(name), 1);
                    box.complete(1);
                    
                    if (running[key].length === 0) {
                        delete running[key];
                        
                        if (Object.keys(running).length === 0) {
                            total.complete(1);
                        }
                    }
                });
                
                test[name](t);
            });
        })
    ;
});

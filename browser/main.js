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

function createTestElement (name, refreshFn) {
    var box = jadeify('test.jade', {
        name : name,
        progress : jadeify('progress.jade')[0].outerHTML,
        ok : 0,
        fail : 0,
    });
    
    box.render = function () {
        box.find('.title .refresh')
            .mouseover(function () {
                $(this).attr('src', 'images/refresh_hover.png');
            })
            .mouseout(function () {
                $(this).attr('src', 'images/refresh.png');
            })
            .click(function (ev) {
                ev.stopPropagation();
                refreshFn();
            })
        ;
        
        var progress = box.find('.progress');
        var pWidth = progress.width();
        var pHeight = progress.height();
        
        progress.ready(function () {
            progress.find('.finished img').width(pWidth).height(pHeight);
            progress.find('.remaining img').width(pWidth).height(pHeight);
            progress.find('.percent').width(pWidth);
        });
        
        box.find('.title').toggle(box.expand, box.collapse);
    };
    
    box.complete = function (p) {
        box.ready(function () {
            var progress = box.find('.progress');
            var pWidth = progress.width();
            var pHeight = progress.height();
            
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
        
            if (p >= 1 && !box.find('.title').hasClass('fail')) {
                box.find('.title').removeClass('ok').addClass('all-ok');
            }
        });
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
    
    box.expand = function (delay) {
        if (typeof delay !== 'number') delay = 200;
        
        var more = box.find('.more');
        if (more.is(':hidden')) {
            more.slideDown(delay, toggleImage);
        }
    };
    
    box.collapse = function (delay) {
        if (typeof delay !== 'number') delay = 200;
        
        var more = box.find('.more');
        if (more.is(':visible')) {
            more.slideUp(delay, toggleImage);
        }
    };
    
    return box;
}

var path = require('path');

$(window).ready(function reload () {
    if (navigator.vendor.match(/^google/i)) {
        $('#browsers .chrome').addClass('active');
    }
    
    $('#browsers img').each(function () {
        var src = $(this).attr('src');
        var browser = path.basename(src).replace(/\.[^.\/]+$/, '');
    });
    
    total = createTestElement('total', function () {
        // somehow stop all the tests first...
        reload();
    });
    total.appendTo('#tests');
    total.render();
    total.tests = [];
    
    Object.keys(require.modules)
        .filter(function (key) {
            return key.match(/^\/_tests\/[^\/]+$/);
        })
        .forEach(function (key) {
            var test = require.call(null, key);
            var file = key
                .replace(/^\/_tests\//, '')
                .replace(/(.js)?$/, '.js')
            ;
            
            runTest(file, key, test);
        })
    ;
});

var running = {};
var boxes = [];

function runTest (file, key, test) {
    running[key] = Object.keys(test);
    
    Object.keys(test).map(function (name) {
        var b = loadTest(file, key, name, test);
        b.appendTo('#tests');
        b.render();
    });
}

function loadTest (file, key, name, test) {
    var box = createTestElement(file + ' : ' + name, function () {
        // first somehow stop the test if it's running
        
        if (!running[key]) running[key] = [];
        
        var b = loadTest(file, key, name, test);
        
        if (box.find('.more').is(':visible')) {
            b.expand(0);
        }
        
        box.replaceWith(b);
        b.render();
    });
    boxes.push(box);
    
    box.ready(function () {
        var t = new Test(name, box.find('div .frames'));
        total.tests.push(t);
        
        var arrow = box.find('.title img.arrow');
        var tArrow = total.find('.title img.arrow');
        
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
            var title = box.find('.title');
            if (!title.hasClass('fail')) title.addClass('ok');
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
            
            if (boxes.every(function (tt) {
                return tt.find('.title').hasClass('ok')
                    || tt.find('.title').hasClass('all-ok')
                ;
            })) total.find('.title').addClass('ok');
            
            if (boxes.every(function (tt) {
                return tt.find('.title').hasClass('all-ok')
            })) total.find('.title').removeClass('ok').addClass('all-ok');
            
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
        
        try {
            test[name](t);
        }
        catch (err) {
            t.emit('fail', 'throw', null, null, err);
        }
    });
    
    return box;
}

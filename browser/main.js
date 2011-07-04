var $ = require('jquery');
var jadeify = require('jadeify');
var TestFile = require('./test/file');

var path = require('path');

$(window).ready(function reload () {
    if (navigator.vendor.match(/^google/i)) {
        $('#browsers .chrome').addClass('active');
    }
    
    $('#browsers img').each(function () {
        var src = $(this).attr('src');
        var browser = path.basename(src).replace(/\.[^.\/]+$/, '');
    });
    
    var tests = TestFile.all();
    
    tests.forEach(function (t) {
        t.box.appendTo('#tests');
    });
    
    var pending = 0;
    $('#all.button').click(function play () {
        var button = $(this);
        button
            .attr('src', 'images/stop.png')
            .unbind('click')
            .click(function stop () {
                tests.forEach(function (t) { t.stop() });
                button.unbind('click').click(function () {
                    tests.forEach(function (t) { t.reset() });
                    play.call(this);
                });
            })
        ;
        
        setTimeout(function () {
            var pending = tests.length;
            tests.forEach(function (t) {
                t.once('end', function () {
                    pending --;
                    
                    if (pending === 0) {
                        button.attr('src', 'images/refresh.png');
                        button.unbind('click').click(function () {
                            tests.forEach(function (t) { t.reset() });
                            play.call(this);
                        });
                    }
                });
                
                if (!t.running) t.run();
            });
        }, 100);
    });
});

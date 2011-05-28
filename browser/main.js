var $ = require('jquery-browserify');
var dnode = require('dnode');

function runTest (test) {
    var t = {
        openWindow : function () {
            $('<iframe>')
                .addClass('viewport')
                .attr('src', '/')
                .appendTo($('#tests'))
            ;
            var win = window[window.length - 1];
            t.windows.push(win);
            return win;
        },
        windows : [],
        navigate : function (win, url, cb) {
            if (typeof win !== 'object') {
                cb = url;
                url = win;
                win = t.windows.length === 0
                    ? t.openWindow()
                    : t.windows.slice(-1)[0]
                ;
            }
            
            win.location.href = url;
            if (cb) {
                setTimeout(function () {
                    $(win).ready(cb);
                }, 0);
            }
        },
        end : function () {
        },
    };
    return test(t);
}

$(window).ready(function () {
    Object.keys(require.modules)
        .filter(function (key) {
            return key.match(/^_tests\//);
        })
        .forEach(function (key) {
            var test = require(key);
            
            Object.keys(test).forEach(function (name) {
                runTest(test[name]);
            });
        })
    ;
});

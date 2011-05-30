var $ = require('jquery-browserify');
var dnode = require('dnode');
var jadeify = require('jadeify');
var Test = require('./test');

function runTest (name, test) {
    var box = jadeify('test.jade', {
        name : name,
        ok : 0,
        fail : 0,
    }).appendTo($('#tests'));
    
    var t = new Test(name);
    var counts = { ok : 0, failed : 0 };
    
    t.on('ok', function () {
        box.vars.ok ++;
    });
    
    t.on('fail', function () {
        box.vars.fail ++;
    });
    
    test(t);
}

$(window).ready(function () {
    Object.keys(require.modules)
        .filter(function (key) {
            return key.match(/^_tests\//);
        })
        .forEach(function (key) {
            var test = require(key);
            
            Object.keys(test).forEach(function (name) {
                runTest(name, test[name]);
            });
        })
    ;
});

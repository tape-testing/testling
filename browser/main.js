var $ = require('jquery');
var jadeify = require('jadeify');
var Test = require('./test');

var path = require('path');

$(window).ready(function reload () {
    if (navigator.vendor.match(/^google/i)) {
        $('#browsers .chrome').addClass('active');
    }
    
    $('#browsers img').each(function () {
        var src = $(this).attr('src');
        var browser = path.basename(src).replace(/\.[^.\/]+$/, '');
    });
    
    Test.all().forEach(function (t) {
        t.box.appendTo('#tests');
        t.run();
    });
});

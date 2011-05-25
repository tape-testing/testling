var assert = require('assert');
var jQuery = require('jquery-browserify');

exports.cmp = function (t) {
    var window = t.openWindow();
    var $ = require('jquery')(window);
    
    t.navigate('about:blank', function () {
        $('<div>')
            .attr('id', 'doom')
            .text('rawr')
            .appendTo(window.document.body)
        ;
        console.log($('#doom').text());
        
        assert.equal(4, 4);
        assert.equal(2, 3);
    });
};

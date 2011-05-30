exports.rawr = function (t) {
    t.createWindow('about:blank', function (window) {
        var $ = require('jquery')(window);
        
        $('<div>')
            .attr('id', 'doom')
            .text('rawr')
            .appendTo(window.document.body)
        ;
        
        t.equal(4, 4);
        t.equal(2, 3);
        t.end();
    });
};

exports.rawr = function (t) {
    t.plan(9);
    
    t.createWindow('/', function (window) {
        var $ = require('jquery')(window);
        
        var form = $('#sign-in-form');
        var email = $(form[0].elements['sign-in.email']);
        var password = $(form[0].elements['sign-in.password']);
        
        t.ok(email[0], 'email element');
        t.ok(password[0], 'password element');
        
        t.ok(email.is(':hidden'), 'email input hidden');
        t.ok(password.is(':hidden'), 'password input hidden');
        
        t.equal(
            $('#user-bar .session-email').text(), '',
            'session empty'
        );
        
        t.ok($('#sign-in-link')[0]);
        $('#sign-in-link').trigger('click');
        
        process.nextTick(function () {
            t.ok(email.is(':visible'));
            t.ok(password.is(':visible'));
            
            email.val('a@b.c');
            password.val('abc');
            $('#sign-in-form').submit();
            
            process.nextTick(function () {
                t.equal($('#user-bar .session-email').text(), 'a@b.c');
                t.end();
            });
        });
    });
};

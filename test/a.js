exports['sign in'] = function (t) {
    t.plan(8);
    
    t.createWindow('/', function (window) {
        var $ = require('jquery')(window);
        
        var form = $('#sign-in-form');
        var email = $(form[0].elements['sign-in.email']);
        var password = $(form[0].elements['sign-in.password']);
        
        if ($('.session-destroy').is(':visible')) {
            $('.session-destroy').click();
        }
        
        setTimeout(function () {
            t.ok(email[0], 'email element');
            t.ok(password[0], 'password element');
            
            t.ok(email.is(':hidden'), 'email input hidden');
            t.ok(password.is(':hidden'), 'password input hidden');
            
            setTimeout(function () {
                t.ok($('#sign-in-link')[0]);
                t.ok($('#sign-in-link').is(':visible'));
                $('#sign-in-link').click();
                
                setTimeout(function () {
                    t.ok(form.is(':visible'));
                    
                    email.val('a@b.c');
                    password.val('abc');
                    $('#sign-in-form').submit();
                    
                    setTimeout(function () {
                        t.equal($('#user-bar .session-email').text(), 'a@b.c');
                        t.end();
                    }, 500);
                }, 500);
            }, 500);
        }, 500);
    });
};

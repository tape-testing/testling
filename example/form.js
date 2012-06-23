var test = require('../');

test('login', function (t) {
    var w = t.createWindow('http://localhost:8081');
    w.next(function (win, $) {
        function finish () {
            if (--pending === 0) t.end();
        }
        
        var form = win.document.getElementsByTagName('form')[0];
        
        t.submitForm(form, function (w) {
            t.equal(w.document.body.innerHTML, 'ACCESS DENIED');
            finish();
        });
        
        $('input[name=user]', form).val('abc');
        $('input[name=pass]', form).val('def');
        
        t.submitForm(form, function (w) {
            t.equal(w.document.body.innerHTML, 'welcome!');
            finish();
        });
    });
});

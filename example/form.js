var test = require('testling');

test('login', function (t) {
    t.createWindow('http://localhost:8081', function (win, $) {
        var pending = 2;
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

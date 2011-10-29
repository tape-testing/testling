var test = require('testling');

test('login', function (t) {
    t.createWindow('http://localhost:8081', function (win) {
        var form = win.document.getElementsByTagName('form')[0];
        t.submitForm(form, function (w) {
            t.equal(w.document.body.innerHTML, 'ACCESS DENIED');
            t.end();
        });
        
        for (var i = 0; i < form.elements.length; i++) {
            var elem = form.elements[i];
            if (elem.name === 'user') elem.value = 'abc';
            if (elem.name === 'pass') elem.value = 'def';
        }
        
        t.submitForm(form, function (w) {
            t.equal(w.document.body.innerHTML, 'welcome!');
            t.end();
        });
    });
});

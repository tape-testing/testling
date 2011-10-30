var test = require('testling');

test('title test', function (t) {
    t.createWindow('http://substack.net/', function (win) {
        t.equal(win.location.href, 'http://substack.net/');
        t.equal(win.document.title, 'The Universe of Discord');
        t.end();
    });
});

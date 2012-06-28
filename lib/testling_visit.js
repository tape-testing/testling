var request = require('request');

module.exports = function (uri, opts, cb) {
    var turi = process.env.TUNNEL;
    var auth = (function () {
        var s = process.env.TESTLING_AUTH.split(':');
        return encodeURIComponent(s[0]) + ':' + encodeURIComponent(s[1]);
    })();
    
    var b = opts.browser.replace(/^testling\./, '').split('/');
    var browser = b[0];
    var version = opts.version || b[1];
    
    var uri = 'http://' + auth + '@localhost:8080/visit?'
        + 'uri=' + encodeURIComponent(uri)
        + '&browser=' + encodeURIComponent(browser + '/' + version)
    ;
    console.log(uri);
    request(uri, function (err, res, body) {
        console.log(body);
        // ...
    });
};

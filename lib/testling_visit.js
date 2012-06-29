var request = require('request');
var withAuth = require('./testling_auth');

module.exports = function (uri, opts, cb) {
    var turi = process.env.TUNNEL;
    var b = opts.browser.replace(/^testling\./, '').split('/');
    var browser = b[0];
    var version = opts.version || b[1];
    
    withAuth(function (auth) {
        var uauth = [ auth.email, auth.password ].map(encodeURIComponent).join(':');
        var u = 'http://' + uauth + '@testling.com/visit?'
            + 'uri=' + encodeURIComponent(uri)
            + '&browser=' + encodeURIComponent(browser + '/' + version)
        ;
        request(u, function (err, res, body) {
            console.log(body);
        });
    });
};

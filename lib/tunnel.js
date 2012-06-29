var withAuth = require('./testling/auth');

module.exports = function () {
    withAuth(function (auth) {
        var uauth = [ auth.email, auth.password ]
            .map(encodeURIComponent).join(':');
        // request('http://' + uauth + 'testling.com');
    });
};

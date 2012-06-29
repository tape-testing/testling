var pw = require('pw');

module.exports = {
    "email" : prompt('testling account email: '),
    "password" : function (cb) {
        pw(function (s) {
            cb(null, Buffer(s).toString('base64'));
        });
    }
};

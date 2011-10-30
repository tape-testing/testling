var http = require('http');
var request = require('request');

exports.exists = function (email, cb) {
    var opts = {
        url : 'http://browserling.com/account/sign-in/email',
        json : { email : email, password : '' },
    };
    request.post(opts, function (err, res, body) {
        if (err) cb(err)
        else if (body === 'Invalid password') {
            cb(null, true);
        }
        else if (body === 'No such account') {
            cb(null, false)
        }
        else cb(body);
    });
};

exports.verify = function (email, password, cb) {
    var opts = {
        url : 'http://browserling.com/account/sign-in/email',
        json : { email : email, password : password },
    };
    request.post(opts, function (err, res, body) {
        if (err) cb(err)
        else if (body === 'Invalid password') {
            cb(null, false);
        }
        else if (body === 'No such account') {
            cb(null, false)
        }
        else if (body === 'ok') {
            cb(null, true)
        }
        else cb(body);
    });
};

exports.create = function (email, password, cb) {
    var opts = {
        url : 'http://browserling.com/account/create/email',
        json : { email : email, password : password },
    };
    request.post(opts, function (err, res, body) {
        if (err) cb(err)
        else if (body === 'ok') cb(null)
        else cb(body)
    });
};

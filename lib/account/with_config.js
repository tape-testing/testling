var fs = require('fs');
var path = require('path');
var seq = require('seq');
var mkdirp = require('mkdirp');
var pw = require('pw');

var user = require('./user');

var stdin = process.stdin;
var stdout = process.stdout;

module.exports = function (configFile, cb) {
    if (!path.existsSync(configFile)) {
        console.log([
            'To use this feature you\'ll need to set up a browserling account.',
            'You can use an existing account or make a new one right here!',
            ''
        ].join('\r\n'));
        
        mkdirp(path.dirname(configFile), 0700, function () {
            createFile(configFile, cb);
        });
    }
    else {
        fs.readFile(configFile, function (err, body) {
            if (err) cb(err)
            else {
                var config = null;
                try { config = JSON.parse(body) }
                catch (err) { cb(err); return }
                if (config) {
                    config.password = new Buffer(config.password, 'base64')
                        .toString();
                    cb(null, config);
                }
            }
        });
    }
};

function createFile (configFile, cb) {
    stdout.write('  email: ');
    
    seq()
        .seq(function () { stdin.once('data', this.ok) })
        .seq(function (email) {
            email = email.toString().trim();
            this.vars.email = email;
            if (email.match(/^[^@]+@[^@]+\.\w[^@]*$/)) {
                user.exists(email, this);
            }
            else {
                this(email + ' doesn\'t look like an email address');
            }
        })
        .seq_(function (next, ex) {
            var email = this.vars.email;
            if (ex) stdout.write('  password: ')
            else stdout.write('  (new account) password: ')
            
            pw(function (pass) {
                if (ex) {
                    user.verify(email, pass, function (err, ok) {
                        if (err) next(err)
                        else if (ok) next(null, pass)
                        else next('invalid password')
                    });
                }
                else if (pass.length < 4) {
                    console.error('password too short');
                }
                else {
                    stdout.write('  confirm password: ')
                    pw(function (confirmed) {
                        if (confirmed !== pass) {
                            next('passwords differ')
                        }
                        else user.create(email, pass, function (err) {
                            if (err) next(err)
                            else {
                                console.log(
                                    '\r\nAccount created! '
                                    + 'You can manage this account at '
                                    + 'http://browserling.com'
                                );
                                next(null, pass)
                            }
                        });
                    });
                }
            });
        })
        .seq(function (pass) {
            var email = this.vars.email;
            this.vars.password = pass;
            
            var body = JSON.stringify({
                email : email,
                // prevent shoulder-surfing:
                password : new Buffer(pass).toString('base64'),
            }, null, 4) + '\r\n';
            
            fs.writeFile(configFile, body, this);
        })
        .seq(function () {
            console.log('\r\nConfiguration written to ' + configFile);
            
            cb(null, {
                email : this.vars.email,
                password : this.vars.password,
            });
        })
        .catch(function (err) {
            cb(err)
        })
    ;
    
    stdin.resume();
}

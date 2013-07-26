#!/usr/bin/env node
var http = require('http');
var spawn = require('child_process').spawn;
var fs = require('fs');

var bouncy = require('bouncy');
var ent = require('ent');
var parseCommand = require('shell-quote').parse;
var copy = require('shallow-copy');

var concat = require('concat-stream');
var finished = require('tap-finished');
var launcher = require('browser-launcher');

var argv = require('optimist').boolean('u').argv;
if (argv.h || argv.help) {
    return fs.createReadStream(__dirname + '/usage.txt').pipe(process.stdout);
}

var unglob = require('../lib/unglob.js');

var path = require('path');
var prelude = fs.readFileSync(__dirname + '/../bundle/prelude.js', 'utf8');

var bundle, launch;
var scripts = [];
var htmlQueue = [];
var pending = 4;
var dir = path.resolve(argv._[0] === '-' ? false : argv._[0] || process.cwd());
var ecstatic = require('ecstatic')(dir);
var resolve = require('resolve').sync;
var pkg = { testling: {} };

if ((process.stdin.isTTY || argv._.length) && argv._[0] !== '-') {
    try {
        pkg = require(path.join(dir, 'package.json'));
    }
    catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') {
            console.error(
                'No package.json in ' + dir + ' found.\n'
                + 'Consult the quick start guide for how to create one:\n'
                + 'https://ci.testling.com/guide/quick_start'
            );
        }
        else {
            console.error(err.message);
        }
        return;
    }
    
    if (!pkg.testling) {
        console.error(
            'The "testling" field isn\'t present '
            + 'in ' + path.join(dir, 'package.json') + '.\n'
            + 'This field is required by testling. Please consult:\n'
            + 'https://ci.testling.com/guide/quick_start'
        );
        return;
    }
    var bundleId = Math.floor(Math.pow(16,8)*Math.random()).toString(16);
    
    if (pkg.testling.preprocess) {
        // todo
    }
    else if (!pkg.testling.html) {
        unglob(dir, pkg.testling, function (err, expanded) {
            if (err) return console.error(err);
            
            var env = copy(process.env);
            env.PATH = path.resolve(dir, 'node_modules/.bin')
                + ':' + env.PATH + ':'
                + path.resolve(__dirname, '../node_modules/.bin')
            ;
            scripts = expanded.script;
            
            if (expanded.file.length) {
                var args = expanded.file.concat('--debug');
                
                var ps = spawn('browserify', args, { cwd: dir, env: env });
                ps.stdout.pipe(concat(function (src) {
                    bundle = src;
                    htmlQueue.forEach(function (f) { getHTML(f) });
                }));
                ps.stderr.pipe(process.stderr);
                ps.on('exit', function (code) {
                    if (code !== 0) {
                        console.error('FAILURE: non-zero exit code');
                    }
                    else ready();
                });
            }
            else if (expanded.script.length) {
                ready();
            }
            else {
                console.error(
                    'No test files, no scripts, and no html parameter found'
                    + 'after expanding the globs. At least one file or a custom'
                    + 'html field is needed.'
                );
                process.exit(1);
            }
        });
    }
}
else {
    process.stdin.pipe(concat(function (src) {
        bundle = src;
        htmlQueue.forEach(function (f) { getHTML(f) });
        ready();
    }));
}

var xws = require('xhr-write-stream')();

if (argv.html) {
    getHTML(function (html) { console.log(html) });
    return;
}

var server = http.createServer(function (req, res) {
    var u = req.url.split('?')[0];
    res.setHeader('connection', 'close');
    
    if (u === '/__testling/sock') {
        req.pipe(xws(function (stream) {
            stream.pipe(process.stdout, { end: false });
            stream.pipe(finished(function (results) {
                if (results.ok) {
                    process.exit(0);
                }
                else process.exit(1);
            }));
        }));
        req.on('end', res.end.bind(res));
    }
    else if (u.replace(/\/$/, '') === '/__testling') {
        res.setHeader('content-type', 'text/html');
        getHTML(function (html) { res.end(html) });
    }
    else if (u.split('/')[1] === '__testling') {
        req.url = req.url.replace(/^\/__testling/, '');
        ecstatic(req, res);
    }
});
server.listen(0, ready);

var customServer = pkg.testling.server && (function () {
    var cmd = pkg.testling.server;
    if (!Array.isArray(cmd)) cmd = parseCommand(cmd);
    if (/\.js$/.test(cmd[0])) cmd.unshift(process.execPath);
    
    var env = copy(process.env);
    env.PORT = Math.floor((Math.pow(2, 16) - 10000) * Math.random() + 10000);
    
    var ps = spawn(cmd[0], cmd.slice(1), { cwd: dir, env: env });
    ps.stdout.pipe(process.stdout);
    ps.stderr.pipe(process.stderr);
    
    ps.on('exit', function (code) {
        console.error('testling.server exited with status: ' + code);
    });
    
    return { port: env.PORT };
})();

var bouncer = bouncy(function (req, res, bounce) {
    if (!customServer || req.url.split('/')[1] === '__testling') {
        bounce(server.address().port);
    }
    else {
        bounce(customServer.port, { headers: { connection: 'close' } });
    }
});
bouncer.listen(0, ready);

if ((argv.x || argv.bcmd) && typeof (argv.x || argv.bcmd) === 'boolean') {
    console.error('-x expects an argument');
    process.exit(1);
}
        
if (argv.u || argv.cmd || argv.x || argv.bcmd) {
    ready();
}
else {
    launcher(function (err, launch_) {
        if (err) return console.error(err);
        launch = launch_;
        ready();
    });
}

function ready () {
    if (--pending !== 0) return;
    
    var opts = {
        headless: true,
        browser: launch && launch.browsers && launch.browsers.local[0].name
    };
    var href = 'http://localhost:' + bouncer.address().port + '/__testling';
    if (argv.u) {
        console.log(href);
    }
    else if (argv.bcmd || argv.x) {
        var cmd = parseCommand(argv.bcmd || argv.x);
        var ps = spawn(cmd[0], cmd.slice(1).concat(href));
        ps.stderr.pipe(process.stderr);
        ps.stdout.pipe(process.stderr);
        ps.on('exit', function (code) {
            if (code !== 0) {
                console.error(
                    'Command ' + JSON.stringify(argv.bcmd)
                    + ' terminated with non-zero exit code'
                );
            }
        });
    }
    else {
        launch(href, opts, function (err, ps) {
            if (err) return console.error(err);
        });
    }
}

function getHTML (cb) {
    if (bundle === undefined) return htmlQueue.push(cb);
    
    if (pkg.testling.html) {
        fs.readFile(path.join(dir, pkg.testling.html), function (err, src) {
            if (err) console.error('while loading testling.html: ' + err);
            else {
                cb('<script>' + prelude + '</script>' + src);
            }
        });
        return;
    }
    var before = '', after = '';
    if (/^mocha(-|$)/.test(pkg.testling.harness)) {
        var mochaFile = path.relative(dir,
            resolve('mocha/mocha.js', { basedir: dir })
        );
        var m = /^mocha-(\w+)/.exec(pkg.testling.harness);
        var ui = m && m[1] || 'bdd';
        before =
            '<script src="' + mochaFile + '"></script>'
            + '<script>mocha.setup(' + JSON.stringify({
                ui: ui, reporter: 'tap'
            }) + ')</script>'
        ;
        after = '<script>mocha.run()</script>';
    }
    
    cb('<html><head><meta charset="utf-8"></head><body>'
        + '<pre id="__testling_output"></pre>'
        + '<script>' + prelude + '</script>'
        + before
        + scripts.map(function (s) {
            return '<script src="' + ent.encode(s) + '"></script>'
        }).join('\n')
        + '<script>' + bundle + '</script>'
        + after
        + '</body></html>'
    );
}

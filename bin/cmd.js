#!/usr/bin/env node
var http = require('http');
var spawn = require('child_process').spawn;
var launcher = require('browser-launcher');
var concat = require('concat-stream');
var finished = require('tap-finished');
var argv = require('optimist').argv;

var unglob = require('../lib/unglob.js');

var fs = require('fs');
var path = require('path');
var prelude = fs.readFileSync(__dirname + '/../bundle/prelude.js', 'utf8');

var bundle, launch, html;
var pending = 3;
var dir = path.resolve(argv._.shift() || process.cwd());
var ecstatic = require('ecstatic')(dir);
var resolve = require('resolve').sync;

if ((process.stdin.isTTY || argv._.length) && argv._[0] !== '-') {
    try {
        var pkg = require(path.join(dir, 'package.json'));
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
    else {
        unglob(dir, pkg.testling, function (err, expanded) {
            if (err) return console.error(err);
            process.env.PATH = path.resolve(dir, 'node_modules/.bin')
                + ':' + process.env.PATH
            ;
            var args = [ '-o', bundleId+'.js' ].concat(expanded.file);
            var ps = spawn('browserify', args, { cwd: dir });
            ps.stdout.pipe(process.stdout);
            ps.stderr.pipe(process.stderr);
            ps.on('exit', function (code) {
                if (code !== 0) {
                    console.error('FAILURE: non-zero exit code');
                }
                else if (--pending === 0) ready();
            });
        });
    }
    
    if (pkg.testling.html) {
        pending ++;
        fs.readFile(path.join(dir, pkg.testling.html), function (err, src) {
            if (err) console.error('while loading testling.html: ' + err);
            else {
                html = src;
                if (--pending === 0) ready();
            }
        });
    }
    else {
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
                }) + ')</script>';
            ;
            after = '<script>mocha.run()</script>';
        }
        
        html = '<html><body>'
            + '<script src="/__testling_prelude.js"></script>'
            + before
            + '<script src="/' + bundleId + '.js"></script>'
            + after
            + '</body></html>'
        ;
    }
}
else {
    html = '<html><body><script src="/bundle.js"></script></body></html>';
    process.stdin.pipe(concat(function (err, src) {
        bundle = src;
        if (--pending === 0) ready();
    }));
}

var xws = require('xhr-write-stream')();

var server = http.createServer(function (req, res) {
    if (req.url === '/sock') {
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
    else if (html && req.url === '/') {
        res.setHeader('content-type', 'text/html');
        res.end(html);
    }
    else if (req.url === '/__testling_prelude.js') {
        res.setHeader('content-type', 'application/javascript');
        res.end(prelude);
    }
    else if (req.url === '/bundle.js') {
        res.setHeader('content-type', 'application/javascript');
        res.end(prelude + '\n' + bundle);
    }
    else {
        ecstatic(req, res);
    }
});

server.listen(0, function () {
    if (--pending === 0) ready();
});

launcher(function (err, launch_) {
    if (err) return console.error(err);
    launch = launch_;
    if (--pending === 0) ready();
});

function ready () {
    var opts = {
        headless: true,
        browser: launch.browsers.local[0].name
    };
    var href = 'http://localhost:' + server.address().port + '/';
    launch(href, opts, function (err, ps) {
        if (err) return console.error(err);
        if (--pending === 0) ready();
    });
}

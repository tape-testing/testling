var fs = require('fs');
var path = require('path');

var argv = require('optimist')
    .usage('Usage: $0 [ test files ]')
    .check(function (argv) {
        if (argv._.length === 0) {
            if (path.existsSync(process.cwd() + '/test')) {
                argv._.unshift(process.cwd() + '/test');
            }
            else if (path.existsSync(process.cwd() + '/tests')) {
                argv._.unshift(process.cwd() + '/tests');
            }
            else throw ''
        }
    })
    .argv
;

var testFiles = argv._.reduce(function reducer (acc, x) {
    if (!path.existsSync(x)) {
        console.error('Test file or directory does not exist: ' + x);
        return [];
    }
    else if (fs.statSync(x).isDirectory()) {
        return fs.readdirSync(x)
            .map(function (file) {
                return path.resolve(x, file)
            })
            .filter(function (file) {
                return !fs.statSync(file).isDirectory()
                    && path.extname(file) === '.js'
            })
        ;
    }
    else if (path.extname(x) === '.js') {
        return acc.concat(x);
    }
    else return [];
}, []);

var testling = require('../');
var suite = testling();

var counts = {};

function print () {
    var percent = Math.floor(
        (suite.counts.total / suite.counts.planned) * 100
    ).toString();
    percent = Array(4 - percent.length).join(' ') + percent;
    
    process.stdout.write('\r' + percent + '% COMPLETE');
}

suite.on('plan', function () {
    print();
});

suite.on('assert', function (res) {
    print();
    if (!res.ok) {
        console.log(
            '\r'
            + 'FAILURE in ' + JSON.stringify(res.test.name)
            + ' at ' + res.test.filename + ' line '
            + res.stack[0].start.line + ':\n'
            + '  ' + res.stack[0].source()
            + '\n    wanted: ' + res.wanted
            + '\n    found: ' + res.found
            + '\n'
        );
    }
});

suite.on('end', function () {
    var percent = Math.floor(suite.counts.pass / suite.counts.total * 100);
    console.log('\n' + percent + '% OF TESTS PASSED');
});

var pending = testFiles.length;
testFiles.forEach(function (file) {
    fs.readFile(file, function (err, src) {
        if (err) console.error(err)
        else suite.append(src, { filename : file })
        pending --;
        if (pending === 0) suite.run();
    });
});

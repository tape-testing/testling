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
        var indent = res.stack[0].lines[0].match(/^\s*/)[0].length;
        var src = res.stack[0].lines
            .map(function (x) {
                var ix = x.match(/\S|$/).index;
                return x.slice(Math.min(ix, indent));
            })
            .join('\n')
        ;
        console.log(
            '\r'
            + 'FAILURE in ' + JSON.stringify(res.test.name)
            + ' at ' + res.test.filename + ' line '
            + (res.stack[0].start.line + 1) + ':\n'
            + '  ' + src
        );
        
        if (res.type === 'equal' && res.stack[0].value[0][2] === 'equal'
        && res.stack[0].value[1][0][0].start) {
            var nodes = {
                wanted : res.stack[0].value[1][0][0],
                found : res.stack[0].value[1][1][0]
            };
            
            var cols = {
                wanted : {
                    start : nodes.wanted.start.col - indent + 2,
                    end : nodes.wanted.end.col - indent + 3
                },
                found : {
                    start : nodes.found.start.col - indent + 2,
                    end : nodes.found.end.col - indent + 3
                }
            };
            cols.wanted.length = cols.wanted.end - cols.wanted.start;
            cols.found.length = cols.found.end - cols.found.start;
            
            var expr = {
                wanted : src
                    .slice(cols.wanted.start - 2, cols.wanted.end - 2)
                ,
                found : src
                    .slice(cols.found.start - 2, cols.found.end - 1)
            };
            
            console.log(
                Array(cols.wanted.start + 1).join(' ')
                + '^'
                + Array(cols.found.start - (cols.wanted.start + 1) + 1).join(' ')
                + '^'
            );
            
            console.log('    (' + expr.wanted + ') == ' + res.wanted);
            console.log('    (' + expr.found + ') == ' + res.found);
            console.log();
        }
        else {
            console.log(
                '    wanted: ' + res.wanted
                + '\n    found: ' + res.found
                + '\n'
            );
        }
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

var outputs = {
    text : require('./lib/output/text')
};

var outputName = process.env.TESTLING_OUTPUT || 'text';
if (outputs[outputName]) {
    var output = outputs[outputName]();
}
else {
    throw [
        'Output format ' + JSON.stringify(outputName) + ' not supported.',
        'Export TESTLING_OUTPUT to set the output format.',
        'Available formats:',
        Object.keys(outputs).map(function (name) {
            return '    ' + name
        }).join('\r\n'),
        ''
    ].join('\r\n');
}

var test = module.exports = require('./lib/test');
test.output = output;

test.push = function (name, res) {
    res.browser = test.browser || 'node/jsdom';
    output(name, res);
};
output('visit', test.browser || 'node/jsdom');
output('launched', test.browser || 'node/jsdom');

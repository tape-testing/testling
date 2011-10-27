var outputs = {
    text : require('./lib/output/text')
};

var outputName = process.env.TESTLING_OUTPUT || 'text';
var output = outputs[outputName];
if (!output) {
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
test.push = function (name, res) {
    console.log(name + ': ' + JSON.stringify(res));
};

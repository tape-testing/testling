var Stream = require('stream');
var domready = require('domready');
var json = typeof JSON === 'object' ? JSON : require('jsonify');

var stream = module.exports = new Stream;
stream.writable = true;

var ready = false;
var buffered = [];
domready(function () {
    ready = true;
    buffered.forEach(function (msg) {
        stream.write(msg);
    });
    buffered = [];
});

stream.write = function (msg) {
    if (!ready) {
        buffered.push(msg);
        return;
    }
    
    var div = document.createElement('div');
    var txt = document.createTextNode(json.stringify(msg));
    div.appendChild(txt);
    document.body.appendChild(div);
};

stream.end = function (msg) {
    if (msg !== undefined) stream.write(msg);
    stream.writable = false;
};

var $ = require('jquery');
var traverse = require('traverse');

module.exports = function (obj) {
    return JSON.stringify(
        traverse(obj).map(function (x) {
            if (this.circular) return '[Circular]';
        })
    );
};

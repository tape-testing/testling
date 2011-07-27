var EventEmitter = require('events').EventEmitter;

module.exports = Test;

function Test (name) {
    this.name = name;
    this.planned = undefined;
}

Test.prototype = new EventEmitter;

Test.prototype.ok = function (value, name) {
    this.emit('assert', {
        type : 'ok',
        ok : Boolean(value),
        name : name,
        found : value,
        wanted : true
    });
    return this;
};

Test.prototype.equal = function (found, wanted, name) {
    this.emit('assert', {
        type : 'equal',
        ok : found == wanted,
        name : name,
        found : found,
        wanted : wanted
    });
    return this;
};

Test.prototype.plan = function (n) {
    this.planned = (this.planned || 0) + n;
    this.emit('plan', n);
    return this;
};

Test.prototype.end = function () {
    this.emit('end');
    return this;
};

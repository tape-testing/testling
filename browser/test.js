var Test = require('tap/lib/tap-test');
var inherits = require('util').inherits;
var schoolbus = require('schoolbus');

inherits(Testling, Test);
module.exports = Testling;

function Testling (harness, name, conf) {
    Test.apply(this, arguments);
}

Testling.prototype.createWindow = function () {
    var bus = schoolbus.apply(null, arguments);
    bus.appendTo(document.body);
    return bus;
};

Testling.prototype.log = function (msg) {
    this.harness.emit('log', msg);
};

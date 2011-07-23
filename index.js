var EventEmitter = require('events').EventEmitter;
var vm = require('vm');
var tap = require('tap');

var exports = module.exports = createSuite();
exports.suite = createSuite;

// hack until tap stops emitting dups
var fixedYet = false;

function createSuite () {
    var harness = new(tap.Harness)(tap.Test);
    
    var self = function () {
        var test = harness.test.apply(harness, arguments);
        
        if (!fixedYet) {
            var seen = [];
        }
        
        test.on('result', function (res) {
            if (!fixedYet) {
                if (seen.indexOf(res) >= 0) return;
                seen.push(res);
            }
            
            self.emit('result', res, test);
        });
        
        return test;
    };
    
    var emitter = new EventEmitter;
    
    Object.keys(EventEmitter.prototype)
        .forEach(function (key) {
            self[key] = emitter[key].bind(emitter);
        })
    ;
    
    return self;
}

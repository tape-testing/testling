var EventEmitter = require('events').EventEmitter;
var vm = require('vm');
var tap = require('tap');
var path = require('path');

var exports = module.exports = function () {
    var suite = exports.suite();
    
    return suite;
};

// hack until tap stops emitting dups
var fixedYet = false;

exports.suite = function () {
    var harness = new(tap.Harness)(tap.Test);
    
    var self = function () {
        var test = harness.test.apply(harness, arguments);
        test.suite = self;
        test.name = test.conf.name;
        
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
    
    self.run = function (filename, src) {
        var dirname = path.dirname(filename);
        
        var context = {
            setInterval : setInterval,
            setTimeout : setTimeout,
            clearInterval : clearInterval,
            clearTimeout : clearTimeout,
            __filename : filename,
            require : function (name) {
                if (name === 'testling') {
                    return function () {
                        var res = self.apply(self, arguments);
                        res.filename = filename;
                        return res;
                    };
                }
                else {
                    var cwd = process.cwd();
                    process.chdir(dirname);
                    var res = require(name);
                    process.chdir(cwd);
                    return res;
                }
            }
        };
        vm.runInNewContext(src, context);
        
        return self;
    };
    
    return self;
}

var EventEmitter = require('events').EventEmitter;
var deepEqual = require('./deep_equal');
var pending = 0;

var test = module.exports = function (name, cb) {
    if (typeof name === 'function') {
        cb = name;
        name = undefined;
    }
    
    var t = new Test(name, test.push);
    pending ++;
    
    t.on('testEnd', function () {
        pending --;
        process.nextTick(function () {
            if (pending <= 0) t.push('end', {});
        });
    });
    
    cb(t);
};

var testId = 0;
function Test (name, push) {
    this.id = testId ++;
    this.push = push;
    push('testBegin', { name : name, testId : this.id });
    
    this.counts = {
        plan : undefined,
        pass : 0,
        fail : 0
    };
    this.windows = [];
}

Test.prototype = new EventEmitter;

Test.prototype.assert = function (res) {
    if (res.ok) this.counts.pass ++
    else this.counts.fail ++
    
    if (this.counts.plan !== undefined
    && this.counts.pass + this.counts.fail > this.counts.plan) {
        this.push('fail', {
            type : 'fail',
            ok : false,
            found : this.counts.fail + this.counts.pass,
            wanted : this.counts.plan,
            name : 'more tests run than planned',
            testId : this.id
        });
    }
    
    res.testId = this.id;
    this.push('assert', res);
    
    if (this.counts.plan !== undefined
    && this.counts.plan === this.counts.pass + this.counts.fail) {
        this.end();
    }
};

Test.prototype.ok = function (value, name) {
    this.assert({
        type : 'ok',
        ok : !!value,
        name : name,
        found : Boolean(value),
        wanted : true
    });
};

Test.prototype.notOk = function (value, name) {
    this.assert({
        type : 'ok',
        ok : !!!value,
        name : name,
        found : Boolean(value),
        wanted : false
    });
};

Test.prototype.fail = function (value, name) {
    this.assert({
        type : 'fail',
        ok : false,
        name : name,
        found : value,
        wanted : undefined
    });
};

Test.prototype.equal = function (found, wanted, name) {
    this.assert({
        type : 'equal',
        ok : found == wanted,
        name : name,
        found : found,
        wanted : wanted
    });
};

Test.prototype.notEqual = function (found, wanted, name) {
    this.assert({
        type : 'notEqual',
        ok : found != wanted,
        name : name,
        found : found,
        wanted : wanted
    });
};

Test.prototype.deepEqual = function (found, wanted, name) {
    this.assert({
        type : 'deepEqual',
        ok : deepEqual(found, wanted),
        name : name,
        found : found,
        wanted : wanted
    });
};

Test.prototype.notDeepEqual = function (found, wanted, name) {
    this.assert({
        type : 'notDeepEqual',
        ok : !deepEqual(found, wanted),
        name : name,
        found : found,
        wanted : wanted
    });
};

Test.prototype.strictEqual = function (found, wanted, name) {
    this.assert({
        type : 'strictEqual',
        ok : found === wanted,
        name : name,
        found : found,
        wanted : wanted
    });
};

Test.prototype.notStrictEqual = function (found, wanted, name) {
    this.assert({
        type : 'strictEqual',
        ok : found !== wanted,
        name : name,
        found : found,
        wanted : wanted
    });
};

function checkThrows (shouldThrow, fn, expected, name) {
    if (typeof expected === 'string') {
        name = expected;
        expected = null;
    }
    var ok = !shouldThrow, err = undefined;
    
    try { fn() }
    catch (e) {
        ok = !ok;
        err = e;
    }
    
    this.assert({
        type : shouldThrow ? 'throws' : 'doesNotThrow',
        ok : ok,
        found : err,
        expected : expected
    });
}

Test.prototype['throws'] = function (fn, expected, name) {
    checkThrows.call(this, true, fn, expected, name);
};

Test.prototype.doesNotThrow = function (fn, expected, name) {
    checkThrows.call(this, false, fn, expected, name);
};

Test.prototype.ifError = function (err, name) {
    this.assert({
        type : 'ifError',
        ok : !!!err,
        name : name,
        found : err,
        wanted : undefined
    });
};

Test.prototype.plan = function (n) {
    if (this.counts.plan === undefined) {
        this.counts.plan = n;
    }
    else {
        this.counts.plan += n;
    }
    this.push('plan', { testId : this.id, n : n });
};

Test.prototype.log = function (msg) {
    this.push('log', { testId : this.id, message : msg });
};

Test.prototype.end = function () {
    if (this.counts.plan !== undefined
    && this.counts.plan > this.counts.fail + this.counts.pass) {
        this.push('planFail', {
            type : 'fail',
            ok : false,
            found : this.counts.fail + this.counts.pass,
            wanted : this.counts.plan,
            name : 'more tests planned than run',
            testId : this.id
        });
    }
    
    if (!this.ended) {
        this.ended = true;
        this.push('testEnd', { testId : this.id });
        this.emit('testEnd');
    }
};

Test.prototype.createWindow = function (opts, cb) {
    // ...
};

Test.prototype.submitForm = function (form, opts, cb) {
    // ...
};

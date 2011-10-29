var http = require('http');
var EventEmitter = require('events').EventEmitter;
var url = require('url');
var path = require('path');

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
            harness.emit('end', t);
        });
    });
    
    cb(t);
};

var harness = test.harness = new EventEmitter;

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
    if (!res.ok) res.stack = stack();
    
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
        wanted : undefined,
        stack : stack()
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

var jsdom = require('jsdom');
var fs = require('fs');
var emptyHtml = '<html><head></head><body></body></html>';

var jqueryWin = jsdom.jsdom(
    '<html><head><script>'
    + fs.readFileSync(__dirname + '/../vendor/jquery-1.6.min.js', 'utf8')
    + '</script></head><body></body></html>'
).createWindow();

Test.prototype.createWindow = function (url, opts, cb) {
    if (typeof url === 'object') {
        cb = opts;
        opts = url;
        url = opts.url;
    }
    
    if (typeof opts === 'function') {
        cb = opts;
        opts = {};
    }
    if (!opts) opts = {};
    opts.url = url;
    
    var win = createWindow(this, opts, cb);
    this.windows.push(win);
    return win;
};

Test.prototype.submitForm = function (form, params, cb) {
    if (typeof params === 'function') {
        cb = params;
        params = {};
    }
    if (!params) params = {};
    
    if (form[0]) {
        if (form[0] instanceof jsdom.defaultLevel.HTMLFormElement
        || form[0].elements) {
            form = form[0];
        }
    }
    
    if (!form.elements) {
        this.fail('encountered a non-form element');
        return;
    }
    
    var pairs = [];
    
    var len = 0;
    for (var i = 0; i < form.elements.length; i++) {
        if (form.elements[i].name) {
            len += form.elements[i].name.length
                + 1 + form.elements[i].value.length;
            pairs.push(
                escape(form.elements[i].name)
                + '='
                + escape(form.elements[i].value)
            );
        }
    }
    
    var data = pairs.join('&');
    var pwin = form.ownerDocument.parentWindow;
    
    var opts = {
        url : form.action || pwin.location.href.split('?')[0],
        method : form.method || 'GET',
        data : data,
        headers : params.headers || {}
    };
    
    if (!opts.url.match(/^https?:/)) {
        opts.url = pwin.location.protocol + '//' + pwin.location.host
            + path.resolve(path.dirname(pwin.location.path), opts.url)
        ;
    }
    
    if (opts.method === 'POST') {
        if (!opts.headers['content-length']
        && opts.headers['transfer-encoding'] !== 'chunked') {
            opts.headers['content-length'] = len + 1;
        }
    }
    
    var win = createWindow(this, opts, cb);
    this.windows.push(win);
    return win;
};

function createWindow (self, opts, cb) {
    if (opts.url && !opts.host) {
        var u = url.parse(opts.url);
        opts.path = u.pathname + (u.search || '');
        opts.host = u.hostname;
        opts.port = u.port || (u.proto === 'https' ? 443 : 80);
    }
    if (!opts.headers) opts.headers = {};
    opts.method = (opts.method || 'GET').toUpperCase();
    
    if (opts.data) {
        if (opts.method === 'GET') {
            opts.path = opts.path.split('?')[0] + '?' + opts.data;
        }
        else if (opts.method === 'POST') {
            if (!opts.headers['content-length']
            && opts.headers['transfer-encoding'] !== 'chunked') {
                opts.headers['content-length'] = opts.data.length;
            }
        }
    }
    
    if (!opts.url) {
        opts.url = (opts.proto.replace(/:\/*$/, '') || 'http')
            + opts.host + (opts.port ? ':' + opts.port : '')
            + (opts.path || '/')
        ;
    }
    
    var doc = jsdom.jsdom(emptyHtml, '3', {
        deferClose : true,
        url : opts.url
    });
    
    var win = doc.createWindow();
    
    win.addEventListener('load', function () {
        var ts = doc.getElementsByTagName('title');
        if (ts.length) doc.title = ts[0] && ts[0].textContent || '';
        
        try {
            cb(win, function (x, y) {
                return y === undefined
                    ? jqueryWin.$(x, doc)
                    : jqueryWin.$(x, y)
            });
        }
        catch (err) {
            self.assert({
                type : 'error',
                error : err
            });
            self.end();
        }
    });
    
    var req = http.request(opts, function (res) {
        res.on('data', function (buf) {
            doc.write(buf.toString());
        });
        
        res.on('end', function () {
            doc.close();
        });
    });
    
    if (opts.method === 'POST' && opts.data) {
        req.write(opts.data + '\r\n');
    }
    req.end();
    
    return win;
}

function stack () {
    var lines = new Error().stack.split('\n').slice(4,-4);
    return lines.join('\n');
}

var Stream = require('stream');
var render = require('./render');
var JSONStream = require('JSONStream');

var push = JSONStream.stringify();
push.pipe(require('shoe')('/push'));

var es = require('event-stream');
var stream = module.exports = es.through();
stream.pipe(render);
stream.pipe(push);

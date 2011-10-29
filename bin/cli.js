#!/usr/bin/env node
var runner = require('../lib/run');

var argv = require('optimist')
    .usage('Usage: testling [test files] {OPTIONS}')
    .demand(1)
    .option('browsers', {
        alias : 'b',
        desc : 'Run your test in real browsers on testling.com.'
    })
    .option('browser-list', {
        alias : 'l',
        desc : 'Show the available browsers on testling.com.'
    })
    .argv
;

runner(argv._);

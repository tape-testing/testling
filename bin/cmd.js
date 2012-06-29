#!/usr/bin/env node

var launcher = require('browser-launcher');
var testlingVisit = require('../lib/testling/visit');
var createServers = require('../lib/servers');

var argv = require('optimist')
    .option('headless', { default : true, type : 'boolean' })
    .default('proxy', 'localhost:54045')
    .default('server', 'localhost:54046')
    .argv
;
argv.files = argv.files || argv._;

var tunnel = require('../lib/tunnel');
if (argv._[0] === 'tunnel') return tunnel();

createServers(argv, function (uri, ports) {
    if (argv.browser === 'echo') {
        console.log([
            uri, '  proxy:     localhost:' + ports.proxy
        ].join('\n'));
    }
    
    if (/^testling\./.test(argv.browser)) {
        testlingVisit(uri, argv, function (err, res) {
            if (err) return console.error(err);
        });
        return;
    }
    
    launcher(function (err, launch) {
        if (err) return console.error(err);
        
        var opts = {
            headless : argv.headless,
            browser : argv.browser,
            version : argv.version,
            proxy : 'localhost:' + ports.proxy,
            noProxy : 'localhost:' + ports.server,
        };
        launch(uri, opts, function (err, ps) {
            if (err) return console.error(err);
            ps.on('exit', function () {
                server.close();
                proxy.close();
            });
        });
    });
});

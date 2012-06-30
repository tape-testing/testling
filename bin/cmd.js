#!/usr/bin/env node

var launcher = require('browser-launcher');
var testlingVisit = require('../lib/testling/visit');
var createServers = require('../lib/servers');
var spawn = require('child_process').spawn;

var argv = require('optimist')
    .option('headless', { default : true, type : 'boolean' })
    .default('proxy', 'localhost:54045')
    .default('server', 'localhost:54046')
    .argv
;
argv.files = argv.files || argv._;

var tunnel = require('../lib/testling/tunnel');
if (argv._[0] === 'tunnel') {
    tunnel(argv.server, function (err, cmd) {
        if (err) return console.error(err);
        console.log('# ' + cmd.join(' '));
        spawn(cmd[0], cmd.slice(1), { customFds : [ 0, 1, 2 ] });
    });
    return;
}

createServers(argv, function (uri, ports) {
    if (argv.browser === 'echo') {
        console.log([
            uri, '  proxy:     localhost:' + ports.proxy
        ].join('\n'));
    }
    
    if (/^testling\./.test(argv.browser)) {
        if (!tunnel.running) {
            console.error(
                "# Make sure the testling tunnel is running or this won't work."
                + '\n# Do: `testling tunnel` to start a tunnel.'
            );
        }
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

var request = require('request');
var archy = require('archy');
var argv = require('optimist').argv;

if (argv['list-browsers']) {
    var opts = {
        uri : 'http://testling.com/browsers.json',
        json : true,
    };
    request(opts, function (err, res, browsers) {
        var remotes = browsers.reduce(function (acc, name) {
            var s = name.split('/');
            var b = s[0], v = s[1];
            
            if (!acc[b]) acc[b] = [];
            acc[b].push(v);
            
            return acc;
        }, {});
        
        var remoteNodes = Object.keys(remotes).map(function (key) {
            var bs = remotes[key].sort(function (a,b) {
                if (isNaN(Number(a))) return 1;
                if (isNaN(Number(b))) return -1;
                return Number(a) - Number(b);
            });
            return { label : key, nodes : bs };
        });
        
        console.log(archy({
            label : 'remote browsers',
            nodes : remoteNodes
        }));
        
        var localNodes = [];
        
        console.log(archy({
            label : 'local browsers',
            nodes : localNodes
        }));
    });
}

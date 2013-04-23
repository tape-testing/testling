var launcher = require('../');
launcher(function (err, launch) {
    if (err) return console.error(err);
    
    console.log('# available browsers:');
    console.dir(launch.browsers);
    
    var opts = {
        browser : 'chrome',
        //headless : true,
        //proxy : 'localhost:7077',
    };
    launch('http://substack.net', opts, function (err, ps) {
        if (err) return console.error(err);
        ps.on('exit', console.log);
    });
});

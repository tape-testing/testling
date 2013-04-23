var launcher = require('../');
launcher.detect(function (available) {
    console.log('# available browsers:');
    console.dir(available);
    
});

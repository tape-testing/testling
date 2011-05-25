var $ = require('jquery-browserify');
var dnode = require('dnode');

$(window).ready(function () {
    console.dir(require.modules);
});

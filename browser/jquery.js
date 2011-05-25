var jQuery = require('jquery-browserify');

module.exports = function (window) {
    return function (x) {
        return jQuery(x, window.document);
    };
};

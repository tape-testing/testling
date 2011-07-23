var jQuery = require('jquery');

module.exports = function (window) {
    if (window.$) return window.$;
    else if (window.jQuery) return window.jQuery;
    else return function (x) {
        return jQuery(x, window.document);
    };
};

var jQuery = require('jquery');

module.exports = function (window) {
    return function (x) {
        return jQuery(x, window.document);
    };
};

exports.immediate = function (t) {
    throw 'immediate error';
};

exports.delayed = function (t) {
    setTimeout(function () {
        throw 'delayed error!';
    }, 100);
};

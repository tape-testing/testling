var glob = require('glob');

module.exports = function (dir, params, cb) {
    var gfiles = withType('file', params.files);
    var gscripts = withType('script', params.scripts);
    var gpostSripts = withType('postScript', params.postScripts);
    
    var gs = gfiles.concat(gscripts);
    var expanded = { file: [], script: [], postScript: [] };
    
    (function next () {
        if (gs.length === 0) {
            return cb(null, expanded)
        }
        
        var opts = { root: dir, cwd: dir };
        var g = gs.shift();
        glob(g.file, opts, function (err, files) {
            if (err) return cb(err);
            
            expanded[g.type].push.apply(expanded[g.type], files);;
            next();
        });
    })();
};

function withType (type, files) {
    var xs = Array.isArray(files)
        ? files.slice()
        : [ files ]
    ;
    return xs
        .filter(Boolean)
        .map(String)
        .map(function (x) { return { type : type, file : x } })
    ;
}

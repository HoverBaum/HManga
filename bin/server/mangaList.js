var fs = require('fs');
var path = require('path');

module.exports = function generateMangaList(callback) {
    var root = process.cwd();
	var list = [];
 	walk(root, function(err, configList) {
		configList.forEach(config => {
			list.push(require(config));
		});
		callback(list);
	});
}

function walk(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function(file) {
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function(err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
					if(/hmanga\.json$/.test(file)) {
						results.push(file);
					}
                    if (!--pending) done(null, results);
                }
            });
        });
    });
};

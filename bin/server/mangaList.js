var walk = require('./findConfigs');

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

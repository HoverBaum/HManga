var findConfigs = require('./findConfigs');

module.exports = function getMangaInfo(name, callback) {
	findConfigs(process.cwd(), function(err, configList) {
		var manga;
		configList.forEach(config => {
			var loaded = require(config);
			if(loaded.urlName === name) {
				manga = loaded;
			}
		});
		callback(manga);
	});
}

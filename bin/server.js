var generateMangaList = require('./server/mangaList');
var getMangaInfo = require('./server/mangaInfo');

function startServer() {
    var express = require('express');
    var app = express();

	app.get('/API/allMangas', function(req, res) {
		generateMangaList(function(list) {
			res.status(200).json(list).end();
		});
	});

	app.get('/API/manga/:name', function(req, res) {
		var name = req.params.name;
		getMangaInfo(name, function(manga) {
			res.json(manga).end();
		})
	});

    app.get('api/manga/:manga', function(req, res) {
        var dir = req.params.manga.replace(/-/g, ' ');
        try {
            var config = require(`./${dir}/${dir}.json`);
            res.status(200).json(config).end();
        } catch (e) {
            res.status(404).end();
        }
    });

    app.get('api/manga/:manga/:chapter/:page', function(req, res) {
        var dir = req.params.manga.replace(/-/g, ' ');
        var chapter = req.params.chapter;
        var page = req.params.page;
        var imageUrl = checkForImage(dir, chapter, page);
        if(imageUrl) {
            var config = require(`./${dir}/${dir}.json`);
            console.log(config);
            res.render('page.ejs', {

            });
        } else  {
            res.send('Problem handling coming soon ;)');
        }
    });



    function checkForImage(dir, chapter, page) {
        try {
            var config = require(`./${dir}/${dir}.json`);

            if (config.chapters[chapter].pages >= page) {
                var options = {
                    root: __dirname + '/public/',
                    dotfiles: 'deny',
                    headers: {
                        'x-timestamp': Date.now(),
                        'x-sent': true
                    }
                };
                var fileName = `${config.dir}/Chapter ${chapter}/${config.name} ch.${chapter} pg.${page}.jpg`;
                return fileName
            } else {

                //This chapter or page does not exist.
                return undefined;
            }
        } catch (e) {
            console.log('Not existing manga requested.');
            return false;
        }
    }

    app.use(express.static(__dirname + '/../public'));

    var listener = app.listen(8080, function(data) {
        var port = listener.address().port
        console.log(`Server on port ${port}`);

        var serverUrl = `http://127.0.0.1:${port}`;
        var open = require('open');
        open(serverUrl);
    });
}

module.exports = startServer;

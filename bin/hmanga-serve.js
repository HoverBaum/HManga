function startServer() {
    var express = require('express');
    var app = express();

    app.get('/manga/:manga', function(req, res) {
        var dir = req.params.manga.replace(/-/g, ' ');
        try {
            var config = require(`./${dir}/${dir}.json`);
            res.status(200).json(config).end();
        } catch (e) {
            res.status(404).end();
        }
    });

    app.get('/manga/:manga/:chapter/:page', function(req, res) {
        var dir = req.params.manga.replace(/-/g, ' ');
        try {
            var config = require(`./${dir}/${dir}.json`);
            var chapter = req.params.chapter;
            var page = req.params.page;
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
                res.sendFile(fileName, options, function(err) {
                    if(err) {
                        console.log(err);
                    }
                });
            } else {

                //This chapter or page does not exist.
                res.status(704).end();
            }
        } catch (e) {
            console.log('Not existing manga requested.');
            res.status(404).end();
        }
    });

    app.use(express.static('public'));

    var listener = app.listen(8080, function(data) {
        var port = listener.address().port
        console.log(`Server on port ${port}`);

        var serverUrl = `http://127.0.0.1:${port}`;
        var open = require('open');
        open(serverUrl);
    });
}

module.exports = startServer;
function startServer() {
    var express = require('express');
    var app = express();


    app.get('/', function(req, res) {
        res.send('Hello World!');
    });

    app.get('/manga/:manga', function(req, res) {
        var dir = req.params.manga.replace(/-/g, ' ');
        var config = require(`./${dir}/${dir}.json`);
    });

    app.use(express.static('public'));

    var listener = app.listen(8080, function(data) {
        var port = listener.address().port
        console.log(`Server on port ${port}`);

        var serverUrl = `http://127.0.0.1:${port}`;
        var open = require('open');
        //open(serverUrl);
    });
}

module.exports = startServer;

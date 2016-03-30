var express = require('express');
var app = express();

function startServer() {



    app.get('/', function(req, res) {
        res.send('Hello World!');
    });

    app.get('/:manga', function(req, res) {
        var dir = req.params.manga;
        
    });

    var listener = app.listen(function(data) {
        var port = listener.address().port
        console.log(`Server on port ${port}`);

        var serverUrl = `http://127.0.0.1:${port}`;
        var open = require('open');
        open(serverUrl);
    });
}

module.exports = startServer;

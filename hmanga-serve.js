var express = require('express');
var http = require('http')
var app = express();

app.get('/', function(req, res) {
    res.send('Hello World!');
});
var server = http.createServer(app);

var listener = app.listen(function(data) {
    var port = listener.address().port
    console.log(`Server on port ${port}`);

    var serverUrl = `http://127.0.0.1:${port}`;
    var open = require('open');
    open(serverUrl);
});

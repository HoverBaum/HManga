var XIN = require('./moderator');
var logger = require('./logger');
var http = require('http');
var fs = require('fs');

module.exports.download = function downloadImageFromUrl(url, page, path) {
    var filePath = path + '.jpg';
    logger.silly(`Getting image from ${url}`);
    var timeoutTime = 20000;
    logger.debug('Image: ' + url);
    var start = Date.now();
    var timedOut = false;
    var failed = false;
    var request = http.get(url, function(res) {
        var imagedata = ''
        res.setEncoding('binary');

        res.on('data', function(chunk) {
            imagedata += chunk
        });

        res.on('end', function() {
            if (failed) return;
            logger.debug('Got image', {
                duration: (Date.now() - start) / 1000,
                url: url,
                timeoutTime: timeoutTime
            });
            fs.writeFile(filePath, imagedata, 'binary', function(err) {
                if (err) {
                    logger.error('Could not write to file.', {
                        error: err,
                        file: filePath,
                        url: url
                    });
                }
                XIN.emit('page-downloaded', page, path);
            });
        });

    }).on('error', function(e) {
        failed = true;
        if (!timedOut) {
            logger.debug('Error while downloading an image', {
                duration: (Date.now() - start) / 1000,
                url: url,
                error: e,
                timeoutTime: timeoutTime
            });
            logger.debug('That went wrong, will try again...');
            setTimeout(function() {
                module.exports.download(url, page, path);
            }, 1000);
        }
    });
    request.setTimeout(timeoutTime, function() {
        timedOut = true;
        failed = true;
        logger.debug('This is takeing longer than expected...');
        request.abort();
        logger.debug('Image download timed out', {
            duration: (Date.now() - start) / 1000,
            url: url,
            error: 'TIMEOUT',
            timeoutTime: timeoutTime
        });
        setTimeout(function() {
            module.exports.download(url, page, path);
        }, 1000);
    });

}

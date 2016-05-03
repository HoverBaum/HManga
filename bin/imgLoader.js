var XIN = require('./moderator');
var logger = require('./logger');
var http = require('http');

module.exports.download = function downloadImageFromUrl(url, page, path) {
    var timeoutTime = 20000;
    logger.debug('Image: ' + link);
    var start = Date.now();
    var timedOut = false;
    var failed = false;
    var request = http.get(link, function(res) {
        var imagedata = ''
        res.setEncoding('binary');

        res.on('data', function(chunk) {
            imagedata += chunk
        });

        res.on('end', function() {
            if (failed) return;
            logger.debug('Got image', {
                duration: (Date.now() - start) / 1000,
                url: path,
                timeoutTime: timeoutTime
            });
            fs.writeFile(path, imagedata, 'binary', function(err) {
                if (err) {
                    logger.error('Could not write to file.', {
                        error: err,
                        file: path,
                        url: path
                    });
                }
                XIN.emit('page-downloaded', page);
            });
        });

    }).on('error', function(e) {
        failed = true;
        if (!timedOut) {
            logger.debug('Error while downloading an image', {
                duration: (Date.now() - start) / 1000,
                url: path,
                error: e,
                timeoutTime: timeoutTime
            });
            logger.warn('That went wrong, will try again...');
            setTimeout(function() {
                module.exports.download(link, path, callback);
            }, 1000);
        }
    });
    request.setTimeout(timeoutTime, function() {
        timedOut = true;
        failed = true;
        logger.warn('This is takeing longer than expected...');
        request.abort();
        logger.debug('Image download timed out', {
            duration: (Date.now() - start) / 1000,
            url: path,
            error: 'TIMEOUT',
            timeoutTime: timeoutTime
        });
        setTimeout(function() {
            module.exports.download(link, path, callback);
        }, 1000);
    });

}

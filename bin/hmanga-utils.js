/**
 *   Provides utility functions for hManga.
 *
 *   @module hmanga-utils
 */

var request = require('request');
var cheerio = require('cheerio');
var logger = require('./logger');
var fs = require('fs');



/**
 *   Returns the domain contained within a URL.
 *   @param {string} url    The URL from which to extract the domain.
 */
exports.getDomainFromURL = function extractDomainFromURL(url) {
    var domain = url.replace('www.', '');
    domain = domain.replace('http://', '');
    domain = domain.replace('https://', '');
    domain = domain.split('/')[0];
    return domain;
}

/**
 *   Creates an initial info object with basic parameters set.
 *   @param {string} url    URL for which to create stub.
 */
exports.initialInfoObject = function createNewInfoObject(url) {
    var domain = exports.getDomainFromURL(url);
    var secure = checkIfHttps(url);
    var info = {
        hosts: [
            {
                domain: domain,
                secure: secure
            }
        ],
        name: undefined
    }
    return info;
}

/**
 *   Checks if a URL contains 'https'.
 *   @param {string} url    URL to checkIfHttps
 *   @returns {boolean} If the URL uses https.
 *   @private
 */
function checkIfHttps(url) {
    if (url.indexOf('https') > -1) {
        return true;
    } else {
        return false;
    }
}

/**
 *   Request a URL and returns a cheerio object.
 *   Does some general error handling and tries to get page again if failing.
 *
 *   @param {string} url    The URL to get.
 *   @param {function}      callback The callback which will be called
 *    with the cheerio object.
 */
exports.getCheerio = function requestToCheerio(url, callback) {
    logger.debug('Getting: ' + url);
    var start = Date.now();
    var timeoutTime = 20000;
    var req = request(url, {
        timeout: timeoutTime
    }, function(err, resp, body) {
        var seconds = (Date.now() - start) / 1000;

        if (err || resp === undefined) {
            //logger.warn('Trouble getting a website, trying again...');
            logger.debug(`Error getting page`, {
                url: url,
                duration: seconds,
                timeoutTime: timeoutTime,
                error: err
            });
            setTimeout(function() {
                requestToCheerio(url, callback)
            }, 1000);
            return;
        }
        if (resp.statusCode !== 200) {
            callback(false);
            return;
        }
        logger.debug(`Finsished getting page`, {
            url: url,
            duration: seconds,
            timeoutTime: timeoutTime
        });
        var $ = cheerio.load(body);
        callback($);
    });
}

/**
 *   Returns a processor that can handle the given URL.
 *   @param {string} url    URL for which to find a processor.
 *   @returns A processor for the URL.
 */
exports.getProcessor = function findProcessorForUrl(url) {
    var hoster = exports.getDomainFromURL(url);
    var moduleId = './hmanga-' + hoster.replace('.', '-'); //TODO Check for named an direct.
    var processor = require(moduleId);
    return processor;
}


/**
 *   Creates a directory if it does not exist.
 *   @param {string} dir    Path to a file or directory to ensure.
 */
exports.ensureDir = function makeSureDirExists(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

var request = require('request');
var cheerio = require('cheerio');

/**
 *   Utility functions for HManga and processors.
 */
module.exports = function() {

    /**
     *   Returns the domain contained within a URL.
     */
    function extractDomainFromURL(url) {
        var domain = url.replace('www.', '');
        domain = domain.replace('http://', '');
        domain = domain.replace('https://', '');
        domain = domain.split('/')[0];
        return domain;
    }

    /**
     *   Creates an initial info object with basic parameters set.
     */
    function createNewInfoObject(url) {
        var domain = extractDomainFromURL(url);
        var secure = checkIfHttps(url);
        var info = {
            domain: domain,
            secure: secure,
            name: undefined
        }
        return info;
    }

    /**
     *   Checks if a URL contains 'https'.
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
     */
    function requestToCheerio(url, callback) {
        request(url, function(err, resp, body) {
            if (err || resp === undefined) {
                console.log('error occured, trying again...');
                setTimeout(requestToCheerio(url, callback), 10000);
                return;
            }
            if (resp.statusCode !== 200) {
                callback(false);
                return;
            }
            var $ = cheerio.load(body);
            callback($);
        });
    }

    /**
    *   Returns a processor that can handle the given URL.
    */
    function findProcessorForUrl(url) {
        var hoster = extractDomainFromURL(url);
        var moduleId = './hmanga-' + hoster.replace('.', '-'); //TODO Check for named an direct.
        var processor = require(moduleId);
        return processor;
    }

    //Export interface.
    return {
        getDomainFromURL: extractDomainFromURL,
        initialInfoObject: createNewInfoObject,
        getCheerio: requestToCheerio,
        getProcessor: findProcessorForUrl
    }

}();

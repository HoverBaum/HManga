var util = require('./hmanga-utils');

/**
 *   HManga Processor for mangareader.net.
 */
module.exports = function() {

    //The function to call after setup is finished.
    var callbackAfterInit = null;

    //Some info about the manga being processed.
    var info;

    //The baseURL to get chapters from.
    var baseURL = '';

    /**
     *   Takes a URL and initializes a processor from it.
     */
    function initializeProcessor(url, callback) {
        callbackAfterInit = callback;
        info = util.initialInfoObject(url);
        baseURL = createBaseUrl(url);
        info.infoPage = baseURL;
        getMoreInfos(baseURL);
    }

    /**
     *   Gets more infos about the currently parsed manga.
     */
    function getMoreInfos(url) {
        util.getCheerio(url, function($) {
            if (!$) {
                console.log('error');
                return;
            }

            //Name
            info.name = $('.aname')[0].children[0].data;

            //genres
            var genres = [];
            $('.genretags').each(function() {
                var genre = this.children[0].data;
                genres.push(genre);
            });
            info.genres = genres;

            //Deeper Processing needed for some infos
            $('.propertytitle').each(function() {
                var propertytitle = this.children[0].data;

                //Set reading direction.
                if (propertytitle === 'Reading Direction:') {
                    if (!this.next.next.children[0]) {
                        return;
                    }
                    var directionText = this.next.next.children[0].data;
                    if (directionText.indexOf('Right to Left') > -1) {
                        info.rightToLeft = true;
                    } else {
                        info.rightToLeft = false;
                    }
                }

                //Release Year
                if (propertytitle === 'Year of Release:') {
                    if (!this.next.next.children[0]) {
                        return;
                    }
                    var releaseYear = parseInt(this.next.next.children[0].data);
                    info.releaseYear = releaseYear;
                }
            });
            callbackAfterInit(info);
        });
    }

    /**
     *   Creates the base URL from which to get chapters later.
     */
    function createBaseUrl(url) {
        var parts = url.split('/');
        var baseURL = parts[0] + '/' + parts[1] + '/' + parts[2] + '/' + parts[3];
        return baseURL;
    }

    /**
     *   Hands the URL for an image for a chapter and page to a callback.
     */
    function generateURLForImage(chapter, page, callback) {
        var pageURL = `${baseURL}/${chapter}/${page}`;
        util.getCheerio(pageURL, function($) {
            if (!$) {

                //This image does not exist, page out of bounds from chapter.
                callback(false);
                return;
            }
            var img = $('#img')[0];
            if(img === undefined) {

                //Reached the End of all chapters.
                callback(false);
                return;
            }
            var link = img.attribs.src;
            callback(link);
        });
    }

    //Return the interface.
    return {
        init: initializeProcessor,
        getImgURL: generateURLForImage
    }

}();
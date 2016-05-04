var util = require('./hmanga-utils');
var XIN = require('./moderator');

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
        info.hosts[0].infoPage = baseURL;
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

                //Ongoing?
                if (propertytitle === 'Status:') {
                    if (!this.next.next.children[0]) {
                        return;
                    }
                    var status = this.next.next.children[0].data;
                    var ongoing = status ? true : false;
                    info.ongoing = ongoing;
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

            //Chapters
            var lastChapterReleased = 0;
            var chapters = [];
            $('#listing tr').each(function() {
                var link = $(this).find('td a');
                if (link.length === 0) return;
                var parts = link.html().split(' ');
                var number = parseInt(parts[parts.length - 1]);
                var dateString = $(this).find('td:last-of-type').html();
                var date = Date.parse(dateString);
                chapters.push({
                    pages: [],
                    finished: false,
                    totalPages: null,
                    chapter: number,
                    released: date
                });
                if (number > lastChapterReleased) {
                    lastChapterReleased = number;
                }
            });
            info.chapters = chapters;
            info.totalChapters = chapters.length;
            info.lastChapterReleased = lastChapterReleased;

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
            if (img === undefined) {

                //Reached the End of all chapters.
                callback(false);
                return;
            }
            var link = img.attribs.src;
            callback(link);
        });
    }

    /**
     *   Returns the number of pages in a given chapter.
     *   @param  {number} chapterNumber - Number of chapter.
     *   @return {number} The number of pages in this chapter.
     */
    function getChapterPages(chapterNumber) {
        var url = `${baseURL}/${chapterNumber}`;
        var pageCount = 0;
        util.getCheerio(url, function($) {
            var elm = $('#selectpage').html();
            var numberString = /\s[1-9]+$/g.exec(elm)[0];
            pageCount = parseInt(numberString);
            XIN.emit('chapter-pages', chapterNumber, pageCount);
        });
    }

    //Return the interface.
    return {
        init: initializeProcessor,
        getImgURL: generateURLForImage,
        getChapterPages: getChapterPages
    }

}();

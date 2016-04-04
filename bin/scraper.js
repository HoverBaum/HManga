var util = require('./hmanga-utils');
var fs = require('fs');
var http = require('http');
var path = require('path');
var logger = require('./logger');

module.exports = function() {

    //Config information for currently handled manga.
    var mangaConfig = {
        info: null,
        lastChapter: 0,
        lastPage: 0,
        dir: null,
        chapters: []
    };

    //The processor we are using.
    var processor = null;

    //Wether things are loaded or not.
    var processorLoaded = false;
    var coreLoaded = false;

    function scrapeByUrl(url) {
        processor = util.getProcessor(url);
        processor.init(url, function(info) {

            //Have to replace '-' with ' ' else server will break.
            info.name = info.name.replace(/-/g, ' ');
            mangaConfig.dir = info.name.toLowerCase();
            mangaConfig.info = info;
            loadCore(info);
            scrapeNextChapter(mangaConfig.lastChapter, false, mangaConfig.lastPage);
        });
    }

    function scrapeChapterByUrl(url, chapterNumber) {
        processor = util.getProcessor(url);
        processor.init(url, function(info) {

            //Have to replace '-' with ' ' else server will break.
            info.name = info.name.replace(/-/g, ' ');
            mangaConfig.dir = info.name.toLowerCase();
            mangaConfig.info = info;
            loadCore(info);
            scrapeChapter(chapterNumber, mangaConfig.dir, chapterCallback, 0);

            function chapterCallback() {

            }
        });
    }

    /**
     *   Loads some core features of the scraper.
     */
    function loadCore(info) {
        makeSureDirExists(mangaConfig.dir);
        checkForConfig(mangaConfig.dir, info.name.toLowerCase());
        logger.info(`Now processing ${mangaConfig.info.name}.`);
    }


    /**
     *   Creates a directory if it does not exist.
     */
    function makeSureDirExists(dir) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }

    /**
     *   Checks if there is a config file in a directory.
     *   Creates an initial one if not.
     */
    function checkForConfig(dir, name) {
        var filePath = dir + '/' + name + '.json';
        if (fs.existsSync(filePath)) {
            mangaConfig = require(path.join(process.cwd(), filePath));
        } else {
            saveConfig();
        }
    }

    /**
     *	Starts the scraping of the next page.
     */
    function scrapeNextChapter(lastChapter, reachedEnd, lastPage) {
        if (!reachedEnd) {
            var currentChapter = lastChapter + 1;
            console.log();
            logger.info(`Getting ${mangaConfig.info.name} chapter ${currentChapter}...`);
            if (lastPage !== undefined && lastPage !== 0) {
                logger.info(`Continuing after page ${lastPage}`);
            }
            scrapeChapter(currentChapter, mangaConfig.dir, scrapeNextChapter, lastPage);
            mangaConfig.lastChapter = lastChapter;
            saveConfig();
        }
        if (reachedEnd) {
            logger.info('\n\nGot all available chapters, enjoy reading.');
        }
    }

    /**
     *	Scrape chapter into a given folder.
     */
    function scrapeChapter(index, folder, callback, lastPage) {
        var pageIndex = (lastPage === undefined) ? 0 : lastPage;
        var folderForChapter = createFolderForChapter(folder, index);
        nextPage();

        //Handle the next page.
        function nextPage(stop) {

            //Finished with chapter?
            if (stop) {
                var reachedEnd = (pageIndex === 1) ? true : false
                if (reachedEnd) {
                    mangaConfig.lastPage = 0;
                }
                mangaConfig.chapters.push({
                    chapter: index,
                    pages: pageIndex - 1
                });

                //Continue to next chapter.
                callback(index, reachedEnd);
                return;
            }

            //Get next page.
            pageIndex += 1;
            scrapePage(pageIndex, nextPage);
        }

        //Actually scrape the page (get the image for it).
        function scrapePage(pageIndex, scrapeCallback) {
            processor.getImgURL(index, pageIndex, function(url) {
                if (!url) {

                    //finished with this chapter.
                    scrapeCallback(true);
                    return;
                }

                //Download image for page of chapter.
                var name = `${mangaConfig.info.name} ch.${index} pg.${pageIndex}`;
                var path = folderForChapter + name + '.jpg';
                downloadImage(url, path, function() {
                    logger.info(`Got ch.${index} pg.${pageIndex}`);
                    mangaConfig.lastPage = pageIndex;
                    saveConfig();
                    scrapeCallback();
                });
            });
        }

    }

    /**
     *   Create a folder for each chapter.
     */
    function createFolderForChapter(folder, index) {
        var chapterFolder = `${mangaConfig.dir}/Chapter ${index}/`;

        //make sure the folder actually exists.
        if (!fs.existsSync(chapterFolder)) {
            fs.mkdirSync(chapterFolder);
        }
        return chapterFolder;
    }

    /**
     *	Downloads an image and saves it at a given path.
     *	Path needs to include filename and ending.
     */
    function downloadImage(link, path, callback) {
        var timeoutTime = 20000;
        logger.debug('Image: ' + link);
        var start = Date.now();
        var timedOut = false;
        var request = http.get(link, function(res) {
            var imagedata = ''
            res.setEncoding('binary');

            res.on('data', function(chunk) {
                imagedata += chunk
            });

            res.on('end', function() {
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
                    callback();
                });
            });

        }).on('error', function(e) {
            var seconds = (Date.now() - start) / 1000;
            logger.debug('Error while downloading an image', {
                duration: (Date.now() - start) / 1000,
                url: path,
                error: e,
                timeoutTime: timeoutTime
            });
            setTimeout(function() {
                downloadImage(link, path, callback);
            }, 1000);
            if (!timedOut) {
                logger.warn('That went wrong, will try again...');
            }
        });
        request.setTimeout(timeoutTime, function() {
            timedOut = true;
            logger.warn('This is takeing longer than expected...');
            request.abort();
        });

    }


    return {
        scrapeChapter: scrapeChapterByUrl,
        scrapeUrl: scrapeByUrl
    }
}
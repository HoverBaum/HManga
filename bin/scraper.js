var util = require('./hmanga-utils');
var fs = require('fs');
var http = require('http');
var path = require('path');
var logger = require('./logger');
var merger = require('./merger');
var util = require('./hmanga-utils.js');
var XIN = require('./moderator');
var imgLoader = require('./imgLoader');

var processor = null;

//NEXT better logging.

/**
 *   Scrape the manga associated with a give url.
 *
 *   @param  {string} url Any URL associated with the manga.
 */
exports.scrapeUrl = function scrapeByUrl(url) {
    processor = util.getProcessor(url);
    processor.init(url, function(info) {
        XIN.emit('processor-loaded', info);
    });
    XIN.subscribe('initialized', function(info) {
        startScraper(info);
    });
}

/**
 *   Scrape only the specified chapter.
 *
 *   @param  {string}   url           Any URL associated with the manga.
 *   @param  {number}   chapterNumber The number of the chapter to scrape.
 *   @param  {Function} callback      Function to call once finished.
 */
exports.scrapeChapter = function scrapeChapterByUrl(url, chapterNumber, callback) {
    //TODO implement this.
}

function initialize(info) {
    info.dir = info.name.toLowerCase();
    util.ensureDir(info.dir);
    var loadedConfig = {};
    if (fs.existsSync(info.config)) {
        loadedConfig = require(path.join(process.cwd(), info.config));
    }
    var mergedInfo = merger(loadedConfig, info);
    mergedInfo.dir = mergedInfo.name.toLowerCase();
    mergedInfo.config = path.join(mergedInfo.dir, mergedInfo.name.toLowerCase().replace(/\s/g, '-')) + '.json';
    logger.debug('Initialization finished');
    XIN.emit('config-changed', mergedInfo);
    XIN.emit('initialized', mergedInfo);
}

function saveConfig(info) {
    logger.debug('Saving config to ' + info.config);
    fs.writeFile(info.config, JSON.stringify(info));
}

function startScraper(info) {
    logger.info(`Starting scraper for ${info.name}`);
    if(info.chapters.every(chapter => {
        return chapter.finsihed
    })) {
        XIN.emit('finished-scraping', info);
        return;
    }
    var finishedChapters = 0;
    info.chapters.forEach(chapter => {
        var previous = chapter.chapter - 1;
        if(chapter.finished && finishedChapters === previous) {
            console.log(chapter.chapter);
            finishedChapters = chapter.chapter;
        }
        XIN.subscribe('chapter-finished').consume(previous, function() {
            scrapeChapter(chapter, info);
        });
    });
    XIN.emit('chapter-finished', finishedChapters, info);
}

function scrapeChapter(chapter, info) {
    if(chapter.finished) {
        XIN.emit('chapter-finished', chapter.chapter, info);
        return;
    }
    //FIXME this is done every time. Probably not loading config right.
    if(chapter.totalPages === null) {
        logger.info(`Getting infos about chapter ${chapter.chapter}`);
        processor.getChapterPages(chapter.chapter);
        XIN.subscribe('chapter-pages').consume(chapter.chapter, function(pageCount) {
            for(var i = 1; i <= pageCount; i++) {
                chapter.pages.push({
                    page: i,
                    finished: false,
                    ignore: false,
                    file: null
                });
            }
            chapter.totalPages = pageCount;
            XIN.emit('config-changed', info);
            scrapeChapter(chapter, info);
        });
        return;
    }
    logger.info(`Now scraping chapter ${chapter.chapter}`);
    chapter.pages.forEach(page => {
        if(!page.finished) {
            downloadPage(chapter.chapter, page.page, info);
            XIN.subscribe('page-downloaded').consume(page.page, function(path) {
                page.file = path;
                logger.info(`Finished chapter ${chapter.chapter} page ${page.page}`);
                page.finished = true;
                XIN.emit('config-changed', info);
                checkChapterFinished(chapter, info);
            });
        }
    });
}

function checkChapterFinished(chapter, info) {
    if(chapter.pages.every(page => {
        return page.finished;
    })) {
        chapter.finished = true;
        XIN.emit('config-changed', info);
        XIN.emit('chapter-finished', chapter.chapter, info);
    }
}

function downloadPage(chapter, page, info) {
    logger.info(`Getting chapter ${chapter} page ${page} of ${info.name}`);
    processor.getImgURL(chapter, page, function(url) {
        var filePath = path.join(`${info.dir}`, `${info.name} chp.${chapter} pg.${page}`);
        imgLoader.download(url, page, filePath);
    });
}

function checkFinish(chapter, info) {
    if(chapter === info.lastChapterReleased) {
        XIN.emit('finished-scraping', info);
    }
}

XIN.subscribe('chapter-finished', function(chapter) {
    logger.info(`Finished chapter ${chapter}`);
});

XIN.subscribe('chapter-finished', checkFinish);
XIN.subscribe('config-changed', saveConfig);
XIN.subscribe('processor-loaded', initialize);

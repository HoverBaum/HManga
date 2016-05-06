/**
 *   MOdule to do the scraping.
 *
 *   @module
 *   @alias HManga/scraper
 */


var util = require('./hmanga-utils');
var fs = require('fs');
var http = require('http');
var path = require('path');
var logger = require('./logger');
var merger = require('./merger');
var util = require('./hmanga-utils.js');
var XIN = require('./moderator');
var imgLoader = require('./imgLoader');
var ProgressBar = require('progress');

var processor = null;

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
    XIN.subscribe('initialized', function(mergedInfo) {
        startScraper(mergedInfo);
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
    info.config = path.join(info.dir, info.name.toLowerCase().replace(/\s/g, '-')) + '.json';
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
    logger.info(`Starting scraper for "${info.name}"`);
    if(info.chapters.every(chapter => {
        return chapter.finished;
    })) {
        XIN.emit('finished-scraping', info);
        return;
    }
    var finishedChapters = 0;
    var lastChapter = 0;
    info.chapters.forEach(chapter => {
        var previous = lastChapter;
        if(chapter.finished && finishedChapters === previous) {
            finishedChapters = chapter.chapter;
        }
        XIN.subscribe('chapter-finished').consume(previous, function() {
            scrapeChapter(chapter, info);
        });
        lastChapter = chapter.chapter;
    });
    XIN.emit('chapter-finished', finishedChapters, info);
}

function scrapeChapter(chapter, info) {
    if(chapter.finished) {
        XIN.emit('chapter-finished', chapter.chapter, info);
        return;
    }
    if(chapter.totalPages === null) {
        getChapterInfo(chapter, info);
        return;
    } else {
        downloadChapterPages(chapter, info);
    }
}

function downloadChapterPages(chapter, info) {
    startChapterProgress(chapter);
    chapter.pages.forEach(page => {
        if(!page.finished) {
            downloadPage(chapter.chapter, page.page, info);
            XIN.subscribe('page-downloaded').consume(page.page, function(path) {
                page.file = path;
                page.finished = true;
                XIN.emit('config-changed', info);
                checkChapterFinished(chapter, info);
            });
        }
    });
}

function getChapterInfo(chapter, info) {
    processor.getChapterPages(chapter.chapter);
    var total = 10;
    var infoBar = new ProgressBar(`Getting information for chapter ${chapter.chapter}/${info.lastChapterReleased} (:bar)`, {
        total: total,
        complete: '*',
        incomplete: ' '
    });
    var forward = true;
    var timer = setInterval(function() {
        if(forward) {
            infoBar.tick();
            if(infoBar.curr > 8) forward = false;
        } else {
            infoBar.tick(-1);
            if(infoBar.curr < 1) forward = true;
        }
    }, 200);
    XIN.subscribe('chapter-pages').consume(chapter.chapter, function(pageCount) {
        for(var i = 1; i <= pageCount; i++) {
            chapter.pages.push({
                page: i,
                finished: false,
                ignore: false,
                file: null
            });
        }
        clearInterval(timer);
        infoBar.tick(total - infoBar.curr);
        XIN.emit('chapter-info', chapter.chapter, chapter);
        chapter.totalPages = pageCount;
        XIN.emit('config-changed', info);
        downloadChapterPages(chapter, info);
    });
}

/**
 *   Start a progress bar for a chapter.
 *   We assume each page to be a step.
 *   @param  {chapter} chapter [description]
 */
function startChapterProgress(chapter) {
    var bar = new ProgressBar(`Downloading chapter ${chapter.chapter} |:bar| :percent`, {
        total: chapter.totalPages,
        width: 20,
        incomplete: ' '
    });

    //Tick bar for each page.
    chapter.pages.forEach(page => {
        if(page.finished) {
            bar.tick();
        } else {
            XIN.subscribe('page-downloaded').consume(page.page, function() {
                bar.tick();
            });
        }
    });

    //Tick the bar forward and back to make it show up faster.
    if(bar.curr < chapter.totalPages - 1) {
        bar.tick();
        bar.tick(-1);
    }
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

function finishUp(info) {
    console.log(' ');
    logger.info(`Finished scraping "${info.name}"`);
    var missing = findMissingChapters(info);
    if(missing.length > 0) {
        logger.warn(`${missing.length} of ${info.lastChapterReleased} chapters ${(missing.length === 1) ? 'is' : 'are'} missing!`);
        missing.forEach(missed => {
            logger.warn(`chapter ${missed}`);
        })
    }
    logger.info(`Start reading with "hmanga serve"`);
}

function findMissingChapters(info) {
    var missing = [];
    for(var i = 1; i <= info.lastChapterReleased; i++) {
        if(info.chapters.every(chapter => {
            return chapter.chapter !== i;
        })) {
            missing.push(i);
        }
    }
    return missing;
}

XIN.subscribe('chapter-finished', checkFinish);
XIN.subscribe('config-changed', saveConfig);
XIN.subscribe('processor-loaded', initialize);
XIN.subscribe('finished-scraping', finishUp)

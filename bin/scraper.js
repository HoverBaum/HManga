var util = require('./hmanga-utils');
var fs = require('fs');
var http = require('http');
var path = require('path');
var logger = require('./logger');
var merger = require('./merger');
var util = require('./hmanga-utils.js');
var XIN = require('./moderator');

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
    info.name = info.name.replace(/-/g, ' ');
    info.config = path.join(info.dir, info.name.toLowerCase().replace(/\s/g, '-')) + '.json';
    util.ensureDir(info.dir);
    var loadedConfig = {};
    if (fs.existsSync(info.config)) {
        loadedConfig = require(path.join(process.cwd(), info.config));
    }
    var mergedInfo = merger(loadedConfig, info);
    XIN.emit('config-changed', info);
    XIN.emit('initialized', info);
}

function saveConfig(info) {
    fs.writeFile(info.config, info);
}

function startScraper(info) {
    if(info.chapters.every(chapter => {
        return chapter.finsihed
    })) {
        XIN.emit('finished-scraping', info);
        return;
    }
    var finishedChapters = 0;
    info.chapters.forEach(chapter => {
        if(chapter.finished && finishedChapters === chapter.chapter - 1) {
            finishedChapters = chapter.chapter;
        }
        XIN.subscribe('chapter-finished').consume(chapter.chapter - 1, function() {
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
    chapter.pages.forEach(page => {
        if(!page.finished) {
            downloadPage(chapter.cahpter, page.page);
            XIN.subscribe('page-downloaded').consume(page.page, function() {
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
    processor.getImgURL(chapter, page, function(url) {
        var path = path.join(`${config.dir}`, `${info.name} chp.${chapter} pg.${page}`);
        imgLoader.download(url, page, path);
    });
}

function checkFinish(chapter, info) {
    if(chapter.chapter === info.lastChapterReleased) {
        XIN.emit('finished-scraping', info);
    }
}

XIN.subscribe('chapter-finished', checkFinish);
XIN.subscribe('config-changed', saveConfig);
XIN.subscribe('processor-loaded', initialize);

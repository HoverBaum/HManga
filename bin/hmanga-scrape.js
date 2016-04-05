#! /usr/bin/env node

var logger = require('./logger');
var cli = require('commander');
var scraper = require('./scraper');

/**
 *   Helper function to collect repeated arguments
 */
function collectChapters(val, all) {
    if (isNaN(val)) {
        return;
    }
    all.push(val);
    return all;
}

cli
    .option('-i, --information', 'Updates information saved about mangas')
    .option('-c, --chapter <chapter>', 'Chapter or range of chapters to update', collectChapters, [])
    .option('--debug', 'Enable debugging mode');

cli.on('--help', function() {
    console.log('  For more information visit:');
    console.log('');
    console.log('    https://github.com/HoverBaum/HManga');
});

cli.parse(process.argv);
var url = cli.args[0];
logger.info('Starting up...');

if (cli.debug) {
    logger.enableDebug();
}

if (cli.information) {
    logger.error('Sorry, information updating is not implemented yet.');
}

if (cli.chapter.length !== 0) {
    logger.info('Getting Chapters...');
    var index = -1;
    function nextChapter() {
        index += 1;
        if(cli.chapter[index]) {
            var number = parseInt(cli.chapter[index]);
            scraper.scrapeChapter(url, number, nextChapter);
        } else {
            logger.log('Finished all requested chapters');
        }
    }
    nextChapter();
}

if(!cli.information && cli.chapter.length === 0) {
    scraper.scrapeUrl(url);
}

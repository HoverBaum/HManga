#! /usr/bin/env node

var logger = require('./logger');
var cli = require('commander');
var scraper = require('./scraper');
var package = require('../package.json');
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
    .version(package.version)
    .option('-i, --information', 'Updates information saved about mangas')
    .option('-c, --chapter <chapter>', 'Chapter or range of chapters to update', collectChapters, [])
    .option('--debug', 'Enable debugging mode');

cli.on('--help', function() {
    console.log('  For more information visit:');
    console.log('');
    console.log('    https://github.com/HoverBaum/HManga');
});

cli.parse(process.argv);


if (cli.debug) {
    logger.enableDebug();
}

if (cli.information) {
    logger.error('Sorry, information updating is not implemented yet.');
}
if (cli.chapter) {
    if (cli.chapter.length === 0) return;
    logger.info('chapter: ', cli.chapter)
}

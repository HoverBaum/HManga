#! /usr/bin/env node

var cli = require('commander');
var scraper = require('./hmanga-scrape');
var server = require('./hmanga-serve');
var logger = require('./logger');


//Prettier output https://www.npmjs.com/package/cli-color
//Parsing commandline input using https://www.npmjs.com/package/commander

cli
    .command('scrape [options] <url>', 'Scrapes a manga', {isDefault: true})
    .command('serve', 'Displays mangas in your browser')
    .parse(process.argv);

if(cli.debug) {
    logger.enableDebug();
}

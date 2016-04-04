#! /usr/bin/env node

var cli = require('commander');
var logger = require('./logger');


//Prettier output https://www.npmjs.com/package/cli-color
//Parsing commandline input using https://www.npmjs.com/package/commander

cli
    .version(require('../package.json').version)
    .command('scrape [options] <url>', 'Scrapes a manga', {isDefault: true})
    .command('serve', 'Displays mangas in your browser')
    .parse(process.argv);

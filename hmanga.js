var cli = require('commander');
var scraper = require('./hmanga-scrape');

//Prettier output https://www.npmjs.com/package/cli-color
//Parsing commandline input using https://www.npmjs.com/package/commander

cli
    .usage('[options] <url ...>')
    .option('-i, --information', 'Updates the information saved about all downloaded mangas.')
    .option('-u, --update', 'Search for updates to mangas.')
    .command('serve', 'Start a website to view downloaded mangas. (coming soon)')
    .parse(process.argv);


if(cli.information) {
    //TODO update infos
} else if(cli.args[0]) {
    scraper(cli.args[0]);
}

var cli = require('commander');
var scraper = require('./hmanga-scrape');
var server = require('./hmanga-serve');

//Prettier output https://www.npmjs.com/package/cli-color
//Parsing commandline input using https://www.npmjs.com/package/commander

cli
    .option('-i, --information', 'Updates the information saved about all downloaded mangas.')
    .option('-u, --update', 'Search for updates to mangas.')
    .arguments('<cmd> [env]')
    .action(function(cmd, env) {
        cmdValue = cmd;
        envValue = env;
    })
    .parse(process.argv);

if (typeof cmdValue === 'undefined') {
    console.error('no command given!');
    process.exit(1);
} else if (cmdValue === 'serve') {
    console.log('Starting server...');
    server();
} else {
    scraper(cli.args[0]);
}
/*
if (cli.information) {
    //TODO update infos
} else if (cli.args[0]) {
    scraper(cli.args[0]);
}
*/

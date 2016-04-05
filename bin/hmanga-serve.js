#! /usr/bin/env node

var logger = require('./logger');
var cli = require('commander');
var startServer = require('./server.js');

cli
    .option('--debug', 'Enable debugging mode');

cli.on('--help', function() {
    console.log('  For more information visit:');
    console.log('');
    console.log('    https://github.com/HoverBaum/HManga');
});

startServer();

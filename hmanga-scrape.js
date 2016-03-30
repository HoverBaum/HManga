var util = require('./hmanga-utils');
var request = require('request');
var http = require('http');
var fs = require('fs');

//Config information for currently handled manga.
var mangaConfig = {
    info: null,
    lastChapter: 0,
    lastPage: 0,
    dir: null,
    chapters: []
}

//The processor we are using.
var processor = null;

//Wether things are loaded or not.
var processorLoaded = false;
var coreLoaded = false;

/**
 *   Starts to process a url and scrape the associated manga.
 */
function startScraper(url) {
    console.log("Starting up...");
    processor = util.getProcessor(url);
    processor.init(url, function(info) {
        mangaConfig.dir = info.name;
        mangaConfig.info = info;
        loadCore(info);
    });
}

/**
 *   Loads some core features of HManga.
 */
function loadCore(info) {
    makeSureDirExists(mangaConfig.dir);
    checkForConfig(mangaConfig.dir, info.name);
    console.log(`Now processign ${mangaConfig.info.name}.`);
    scrapeNextChapter(mangaConfig.lastChapter, false, mangaConfig.lastPage);
}

/**
 *   Saves the current config to a file.
 */
function saveConfig() {
    var filePath = mangaConfig.dir + '/' + mangaConfig.info.name + '.json';
    var data = JSON.stringify(mangaConfig);
    fs.writeFileSync(filePath, data);
}

/**
 *   Creates a directory if it does not exist.
 */
function makeSureDirExists(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

/**
 *   Checks if there is a config file in a directory.
 *   Creates an initial one if not.
 */
function checkForConfig(dir, name) {
    var filePath = dir + '/' + name + '.json';
    if (fs.existsSync(filePath)) {
        mangaConfig = require('./' + filePath);
    } else {
        saveConfig();
    }
}

/**
 *	Starts the scraping of the next page.
 */
function scrapeNextChapter(lastChapter, reachedEnd, lastPage) {
    if(!reachedEnd) {
        var currentChapter = lastChapter + 1;
        console.log(`\nGetting chapter ${currentChapter}...`);
        if(lastPage !== undefined) {
            console.log(`Continuing after page ${lastPage}`);
        }
        scrapeChapter(currentChapter, mangaConfig.dir, scrapeNextChapter, lastPage);
        mangaConfig.lastChapter = lastChapter;
        saveConfig();
    }
    if(reachedEnd) {
        console.log('\n\nGot all available chapters, enjoy reading.');
    }
}

/**
 *	Scrape page into a given folder.
 */
function scrapeChapter(index, folder, callback, lastPage) {
    var pageIndex = (lastPage === undefined) ? 0 : lastPage;
    var folderForChapter = createFolderForChapter(folder, index);
    nextPage();

    //Handle the next page.
    function nextPage(stop) {

        //Finished with chapter?
        if (stop) {
            var reachedEnd = (pageIndex === 1) ? true : false
            mangaConfig.chapters.push({
                chapter: index,
                pages: pageIndex - 1
            });
            callback(index, reachedEnd);
            return;
        }

        //Get next page.
        pageIndex += 1;
        scrapePage(pageIndex, nextPage);
    }

    //Actually scrape the page (get the image for it).
    function scrapePage(pageIndex, scrapeCallback) {
        processor.getImgURL(index, pageIndex, function(url) {
            if (!url) {

                //finished with this chapter.
                scrapeCallback(true);
                return;
            }

            //Download image for page of chapter.
            var name = `${mangaConfig.info.name} ch.${index} pg.${pageIndex}`;
            var path = folderForChapter + name + '.jpg';
            downloadImage(url, path, function() {
                console.log(`Got ch.${index} pg.${pageIndex}`);
                mangaConfig.lastPage = pageIndex;
                saveConfig();
                scrapeCallback();
            });
        });
    }

}

/**
 *   Create a folder for each chapter.
 */
function createFolderForChapter(folder, index) {
    var chapterFolder = `${mangaConfig.dir}/Chapter ${index}/`;

    //make sure the folder actually exists.
    if (!fs.existsSync(chapterFolder)) {
        fs.mkdirSync(chapterFolder);
    }
    return chapterFolder;
}

/**
 *	Downloads an image and saves it at a given path.
 *	Path needs to include filename and ending.
 */
function downloadImage(link, path, callback) {
    var request = http.get(link, function(res) {
        var imagedata = ''
        res.setEncoding('binary')

        res.on('data', function(chunk) {
            imagedata += chunk
        })

        res.on('end', function() {

            //When all data is here, save image at provided path.
            fs.writeFile(path, imagedata, 'binary', function(err) {
                if (err) throw err
                callback();
            });
        });

    });
}

//The code that is run and uses the input from the user on the commandline.
module.exports = startScraper;

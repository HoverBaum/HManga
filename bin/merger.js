/**
 *   A small module to merge loaded configs and ones from processors.
 *   Will assume that the information in the parsed is more omportant and accurate.
 *
 *   @module merger
 */

module.exports = function merge(loaded, parsed) {
    loaded = mergeBasics(loaded, parsed);
    loaded = mergeHosts(loaded, parsed);
    loaded = mergeGenres(loaded, parsed);
    loaded = mergeChapters(loaded, parsed);
    return computeValues(loaded);
}

/**
 *   Compute the last few values.
 *   @param  {[type]} loaded [description]
 *   @return {[type]}        [description]
 */
function computeValues(loaded) {
    loaded.totalChapters = loaded.chapters.length;
    var lastChapter = 0;
    loaded.chapters.forEach(chapter => {
        if(chapter.chapter > lastChapter) {
            lastChapter = chapter.chapter;
        }
    });
    loaded.lastChapterReleased = lastChapter;
	loaded.urlName = loaded.name.replace(/\s/g, '-').toLowerCase();
    return loaded;
}

/**
 *   Merge chapters into loaded.
 *   @param  {[type]} loaded [description]
 *   @param  {[type]} parsed [description]
 *   @return {[type]}        [description]
 */
function mergeChapters(loaded, parsed) {
    if(!loaded.chapters) {
        loaded.chapters = [];
    }

    //Push all chapters we are not already tracking into loaded.
    parsed.chapters.forEach(parsedChapter => {
        if(loaded.chapters.every(function(chapter) {
            return parsedChapter.chapter !== chapter.chapter;
        })) {
            loaded.chapters.push(parsedChapter);
        }
    });
    return loaded;
}

/**
 *   Merge loaded genres into parsed ones.
 *   @param  {[type]} loaded [description]
 *   @param  {[type]} parsed [description]
 *   @return {[type]}        [description]
 */
function mergeGenres(loaded, parsed) {
    if(!loaded.genres) {
        loaded.genres = [];
    }

    //Push all genres we are not aware of into loaded.
    parsed.genres.forEach(loadedGenre => {
        if(!(loaded.genres.indexOf(loadedGenre) > -1)) {
            loaded.genres.push(loadedGenre);
        }
    });
    return loaded;
}

/**
 *   Merge hosts from loaded into parsed.
 *   @param  {[type]} loaded [description]
 *   @param  {[type]} parsed [description]
 *   @return {[type]}        [description]
 */
function mergeHosts(loaded, parsed) {
    if(!loaded.hosts) {
        loaded.hosts = [];
    }

    //Push all hosts we don't know of inot loaded.
    parsed.hosts.forEach(loadedHost => {
        if(loaded.hosts.every(function(host) {
            return host.domain !== loadedHost.domain;
        })) {
            loaded.hosts.push(loadedHost);
        }
    });
    return loaded;
}

/**
 *   Merge basic information into loaded and return it.
 *   @param  {[type]} loaded [description]
 *   @param  {[type]} parsed [description]
 *   @return {[type]}        [description]
 */
function mergeBasics(loaded, parsed) {
    loaded.name = parsed.name;
    loaded.ongoing = parsed.ongoing;
    loaded.rightToLeft = parsed.rightToLeft;
    return loaded;
}

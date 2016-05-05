const merger = require('../bin/merger');
module.exports = function(test) {

    //TODO get a parsed and loaded data and merge them. Check it works right. And find any issues.
    //Assumed data we get from a website.
    var parsed = require('./assets/parsed');

    //Empty config
    var empty = {};

    //Assumed locally stored config.
    var loaded = require('./assets/loaded');

    test('Merge empty config', function(t) {

        var emptyMerged = merger({}, parsed);
        t.deepEqual(emptyMerged.hosts, parsed.hosts, 'Empty config, hosts');
        t.deepEqual(emptyMerged.chapters, parsed.chapters, 'Empty config, chapters');
        t.deepEqual(emptyMerged.genres, parsed.genres, 'Empty config, genres');
        t.equal(emptyMerged.name, parsed.name, 'Empty config, name');
        t.equal(emptyMerged.ongoing, parsed.ongoing, 'Empty config, ongoing');
        t.equal(emptyMerged.rightToLeft, parsed.rightToLeft, 'Empty config, rightToLeft');
        t.equal(emptyMerged.totalChapters, 4, 'Empty config, totalChapters');
        t.equal(emptyMerged.lastChapterReleased, 5, 'Empty config, lastChapterReleased');

        t.end();
    });

    test('Merge loaded config', function(t) {

        var merged = merger(loaded, parsed);
        t.deepEqual(merged.hosts, parsed.hosts, 'Empty config, hosts');
        t.equal(merged.chapters.length, 4, 'Loaded config, chapters');

        //Check that only unadded genres get added.
        t.deepEqual(merged.genres, loaded.genres, 'Loaded config, genres');
        t.equal(merged.name, parsed.name, 'Loaded config, name');
        t.equal(merged.ongoing, parsed.ongoing, 'Loaded config, ongoing');
        t.equal(merged.rightToLeft, parsed.rightToLeft, 'Loaded config, rightToLeft');
        t.equal(merged.totalChapters, 4, 'Loaded config, totalChapters');
        t.equal(merged.lastChapterReleased, 5, 'Loaded config, lastChapterReleased');
        t.equal(merged.chapters[0].pages.length, 4, 'Loaded config, progress remains');
        t.equal(merged.chapters[1].finished, true, 'Loaded config, progress remains at multiple places');

        t.end();
    });
}

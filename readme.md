## UNDER DEVELOPMENT

[![Project Status: Abandoned - Initial development has started, but there has not yet been a stable, usable release; the project has been abandoned and the author(s) do not intend on continuing development.](http://www.repostatus.org/badges/latest/abandoned.svg)](http://www.repostatus.org/#abandoned)

BETA: you can scrape and serve mangas. But only from mangareader.net.

Roadmap to v1.0
- [x] Basic prototype
- [x] Awesome console feedback
- [ ] Refactor scraper, make more modular
- [ ] Use scraper from served website
- [ ] Refactore website to not use router
- [ ] Improve user experience
- [ ] Create ecosystem for parsers
- [ ] Unit test everything

User Experience
- [ ] Reduce load times (probably just remove router)
- [ ] Nice AppBar in entire app (also as navigation)
- [ ] Jump while reading (other chapter, page)
- [ ] Save Reading progress
- [ ] Maybe stick AppBar to top

Further plans
- [ ] Desktop app using Electron
- [ ] Preload more than current chapter in browser

## Usage

To download a manga run `hmanga <url to manga>`. This will download the manga into a sub-folder of the current directory. You can specify any url associated with a manga. Leaving the url blank will instead look for updates to all previously downloaded mangas.

```
Usage: hmanga [options] [command]


Commands:

    scrape [options] <url>  Scrapes a manga
    serve                   Displays mangas in your browser
    help [cmd]              display help for [cmd]

Options:

    -h, --help     output usage information
    -V, --version  output the version number
 ```

### hmanga serve

Starts a website that you can use to view all your mangas. It will handle all mangas in the current and all subdirectories.

Simply run `hmanga serve`.

# Manga info

Documentation of how an information object should look.

```
{
    name: String
    hosts: [
        {
            domain: String
            infoPage: String
            secure: Boolean
        }
    ]
    genres: [
        String
    ]
    ongoing: boolean
    rightToLeft: boolean
    chapters:[
        {
            pages: [
                page: number
                finished: boolean
                ignore: false
                file: string
            ]
            finished: boolean
            totalPages: number (null for no info)
            chapter: number
            released: timestamp
        }
    ]
    totalChapters: number
    lastChapterReleased: number
}
```

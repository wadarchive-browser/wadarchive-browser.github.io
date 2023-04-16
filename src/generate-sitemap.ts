import { createReadStream, createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import { resolve } from 'path';
import { createGzip } from 'zlib';
import { Readable } from 'stream';
import { SitemapAndIndexStream, SitemapStream, lineSeparatedURLsToSitemapOptions, type SitemapItem, type SitemapItemLoose, EnumChangefreq } from 'sitemap';
import { createInterface } from 'readline/promises';
import MemoryStream from 'memorystream';

const pathRoot = 'https://wadarchive-browser.github.io/';

const staticRoot = resolve('../static');

await mkdir(resolve(staticRoot, 'sitemaps'), { recursive: true });

const sms = new SitemapAndIndexStream({
    // SitemapAndIndexStream will call this user provided function every time
    // it needs to create a new sitemap file. You merely need to return a stream
    // for it to write the sitemap urls to and the expected url where that sitemap will be hosted
    getSitemapStream(i) {
        const sitemapStream = new SitemapStream({ hostname: pathRoot });
        // if your server automatically serves sitemap.xml.gz when requesting sitemap.xml leave this line be
        // otherwise you will need to add .gz here and remove it a couple lines below so that both the index
        // and the actual file have a .gz extension
        const path = `sitemaps/sitemap-${i}.xml`;

        const ws = sitemapStream
            //.pipe(createGzip()) // compress the output of the sitemap
            .pipe(createWriteStream(resolve(staticRoot, path))); // write it to sitemap-NUMBER.xml

        return [new URL(path, pathRoot).toString(), sitemapStream, ws];
    },
});

(async () => {
    const allWadIds = createInterface({
        input: createReadStream(resolve(staticRoot, 'allWadIds.txt'))
    });

    for await (const wadId of allWadIds) {
        // console.log(line);
        sms.write({
            url: new URL(`wad?id=${wadId}`, pathRoot).toString(),
            changefreq: EnumChangefreq.YEARLY
        } satisfies SitemapItemLoose);
    }

    sms.end(); // necessary to let it know you've got nothing else to write
})();

// or reading straight from an in-memory array
sms
    .pipe(createGzip())
    .pipe(createWriteStream(resolve(staticRoot, 'sitemap-index.xml.gz')));

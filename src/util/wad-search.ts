import { HexConverter } from './msgpack-models';

import uFuzzy from '@leeoniya/ufuzzy';
import { MessagePackObject, key, type } from './msgpack-serializer';
import { fetchAndParseZstd, queryWad } from './wad-lookup';

export class WadFuzzy extends MessagePackObject {
    @key(0) @type(HexConverter) readonly Id!: string;
    @key(1) @type(HexConverter) readonly Md5!: string;
    @key(2) @type(HexConverter) readonly Sha256!: string;
    @key(3) readonly Names!: string[];
    @key(4) readonly Filenames!: string[];
}

class SearchEngine {
    private readonly haystack: string[];
    private readonly wadsFuzzy: WadFuzzy[];
    private readonly uf = new uFuzzy();

    constructor(wadsFuzzySerialized: unknown[][]) {
        this.wadsFuzzy = wadsFuzzySerialized.map(e => new WadFuzzy(e));
        this.haystack = this.wadsFuzzy.map(wad => `${wad.Id} ${wad.Md5} ${wad.Sha256} ${wad.Names.join(' ')} ${wad.Filenames.join(' ')}`);
    }

    searchWads(searchQuery: string) {
        console.time('Search for ' + searchQuery);
        const [idxs, info, order] = this.uf.search(
            this.haystack,
            searchQuery,
            1,
            100_000
        );
        console.timeEnd('Search for ' + searchQuery);

        if (order === null || info === null) {
            return {
                count: 0,
                filteredOrderedCount: 0,
                // eslint-disable-next-line require-yield
                *get() {
                    return;
                }
            };
        }

        const wadsFuzzy = this.wadsFuzzy;
        return {
            count: idxs.length,
            filteredOrderedCount: order.length,
            *get() {
                // render post-filtered & ordered matches
                for (let i = 0; i < order.length; i++) {
                    // using info.idx here instead of idxs because uf.info() may have
                    // further reduced the initial idxs based on prefix/suffix rules
                    yield wadsFuzzy[info.idx[order[i]]];
                }
            }
        };
    }
}

let searchData: SearchEngine | undefined;

export interface SearchResult {
    count: number;
    results: WadFuzzy[];
}

export async function searchWads(searchQuery: string, limit = 1000): Promise<SearchResult> {
    searchData ??= new SearchEngine(await fetchAndParseZstd('/wadsFuzzy.msg.zstd') as unknown[][]);

    const results = searchData.searchWads(searchQuery);
    return {
        count: results.count,
        results: [...limitIterable(results.get(), limit)]
    };
}

function *limitIterable<T>(iterable: Iterable<T>, limit: number) {
    let index = 0;
    for (const item of iterable) {
        if (index++ >= limit) return;
        yield item;
    }
}


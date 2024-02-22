import { Wad, WadLumps } from './msgpack-models';
import { decode as msgpackDecode } from '../msgpack-javascript/src/index';
import { Zstd } from '@hpcc-js/wasm';
import { openDB } from 'idb';
import { browser } from '$app/environment';

const db = browser ? await openDB('WadCache', 1, {
    upgrade(database, oldVersion, newVersion, transaction, event) {
        database.createObjectStore('CachedData');
    },
}) : undefined;

export async function fetchZstd(path: string, cache = true): Promise<ArrayBuffer> {
    console.log(path);
    const zstd = await Zstd.load();

    if (browser) {
        const existingResult = await db!.get('CachedData', path);
        if (existingResult !== undefined) {
            return existingResult;
        }
    }

    const result = await fetch(path, {
        cache: 'force-cache'
    })
        .then(e =>  e.arrayBuffer())
        .then(e => {
            console.time('Decompress ' + path);
            const result = zstd.decompress(new Uint8Array(e));
            console.timeEnd('Decompress ' + path);
            return result;
        });

    if (cache && browser) {
        await db!.add('CachedData', result, path);
    }
    return result;
}

export async function queryWad(id: string): Promise<Wad> {
    const decompressedMessage = await fetchZstd(`/wad-data/${id.slice(0, 3)}.msg.zstd`);

    const decodedMessage = msgpackDecode(decompressedMessage, { useBigInt64: true }) as Record<string, unknown[]>;

    return new Wad(decodedMessage[id]);
}

export async function queryLumpList(wad: Wad): Promise<WadLumps | undefined> {
    if (wad.LumpsInfoIndex == null) return undefined;

    const decompressedMessage = await fetchZstd(`/lumps${wad.LumpsInfoIndex[0]}/${wad.LumpsInfoIndex[1]}.msg.zstd`, false);

    console.time('Decode LumpList ' + wad.Id);
    const decodedMessage = msgpackDecode(decompressedMessage, { useBigInt64: true }) as Record<string, unknown[]>;
    console.timeEnd('Decode LumpList ' + wad.Id);

    if (wad.Id in decodedMessage)
        return new WadLumps(decodedMessage[wad.Id]);

    return undefined;
}

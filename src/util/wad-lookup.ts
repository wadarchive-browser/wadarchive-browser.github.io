import { Wad } from './msgpack-models';
import { decode as msgpackDecode } from '../msgpack-javascript/src/index';
import { gunzip } from './fflate-promisified';

const cachedFiles = new Map<string, ArrayBuffer>();

export async function fetchGzip(path: string, cache = true): Promise<ArrayBuffer> {
    const existingResult = cachedFiles.get(path);
    if (existingResult !== undefined) {
        return existingResult;
    }

    const result = await fetch(path, {
        method: 'GET',
        credentials: 'same-origin',
        mode: 'cors'
    }).then(e => {
        return e.headers.get('content-encoding') !== 'gzip'
            ? e.arrayBuffer().then(e => gunzip(new Uint8Array(e)))
            : e.arrayBuffer();
    });
    if (cache) {
        cachedFiles.set(path, result);
    }
    return result;
}

export async function queryWad(id: string): Promise<Wad> {
    const decompressedMessage = await fetchGzip(`/wad-data/${id.slice(0, 2)}.msg.gz`);

    const decodedMessage = msgpackDecode(decompressedMessage, { useBigInt64: true }) as Record<string, unknown[]>;

    return new Wad(decodedMessage[id]);
}

import { convertKeys } from '.';
import { HexConverter, Wad, convertUint8ArrayToHex } from './msgpack-models';
import { decode as msgpackDecode } from '../msgpack-javascript/src/index';
import { gunzipStream } from './fflate-promisified';
import { arrayBuffer } from './stream-consumers';

const cachedFiles = new Map<string, ArrayBuffer>();

async function fetchBufferAndCache(path: string): Promise<ArrayBuffer> {
    const existingResult = cachedFiles.get(path);
    if (existingResult !== undefined) {
        return existingResult;
    }

    const result = await fetch(path)
        .then(e => {
            return e.headers.get('content-encoding') !== 'gzip'
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                ? arrayBuffer(gunzipStream(e.body!))
                : e.arrayBuffer();
        });
    cachedFiles.set(path, result);
    return result;
}

async function querySingleWad(id: string): Promise<Wad> {
    const decompressedMessage = await fetchBufferAndCache(`/wad-data/${id.slice(0, 2)}.msg.gz`);

    const decodedMessage = msgpackDecode(new Uint8Array(decompressedMessage), { useBigInt64: true }) as Record<string, unknown[]>;

    return new Wad(decodedMessage[id]);
}

export async function queryWad(filenameOrId: string, count = 1): Promise<Wad[]> {
    if (count < 1) {
        throw new Error('Count must be at least 1');
    }

    if (/[a-f0-9]{40}/.test(filenameOrId)) {
        return [await querySingleWad(filenameOrId)];
    } else {
        const wadsKeyedByFileName = await fetchBufferAndCache('/wadsKeyedByFileName.msg.gz')
            .then(e => msgpackDecode(new Uint8Array(e), { useBigInt64: true })) as Record<string, Uint8Array[]>;

        if (!(filenameOrId in wadsKeyedByFileName)) {
            return [];
        }

        const results: Wad[] = [];
        let i = 0;
        for (const wadId of wadsKeyedByFileName[filenameOrId]) {
            results.push(await querySingleWad(HexConverter.convert(wadId)));
            if (++i >= count) break;
        }

        return results;
    }
}

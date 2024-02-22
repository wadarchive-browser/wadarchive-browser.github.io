import { expose } from 'comlink';
import { Zstd } from '@hpcc-js/wasm';
import { decode as msgpackDecode } from '../msgpack-javascript/src/index';

const zstdPromise = Zstd.load();

expose({
    async fetchAndDecompress(path: string) {
        const zstd = await zstdPromise;
        const fetched = await fetch(path, {
            cache: 'force-cache'
        });

        console.time('Decompress & decode ' + path);
        console.time('Decompress ' + path);
        const result = zstd.decompress(new Uint8Array(await fetched.arrayBuffer()));
        console.timeEnd('Decompress ' + path);
        console.time('Decode ' + path);
        const decode = msgpackDecode(result, { useBigInt64: true });
        console.timeEnd('Decode ' + path);
        console.timeEnd('Decompress & decode ' + path);

        return decode;
    }
});
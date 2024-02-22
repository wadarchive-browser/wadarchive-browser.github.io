import { expose } from 'comlink';
import Zstd from 'zstandard-wasm/speed';
import { decode as msgpackDecode } from '../msgpack-javascript/src/index';

const zstdPromise = Zstd.loadWASM();

expose({
    async fetchAndDecompress(path: string) {
        await zstdPromise;

        const fetched = await fetch(path, {
            cache: 'force-cache'
        });

        console.time('Decompress & decode ' + path);
        console.time('Decompress ' + path);
        const result = Zstd.decompress(new Uint8Array(await fetched.arrayBuffer()));
        console.timeEnd('Decompress ' + path);
        console.time('Decode ' + path);
        const decode = msgpackDecode(result, { useBigInt64: true });
        console.timeEnd('Decode ' + path);
        console.timeEnd('Decompress & decode ' + path);

        return decode;
    }
});
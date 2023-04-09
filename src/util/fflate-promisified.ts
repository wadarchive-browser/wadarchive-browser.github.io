import { AsyncGunzip, gunzip as gunzipCallback } from 'fflate';
import { stream2iterator } from './stream-consumers';
import { promisify } from './promisify';

export const gunzip = promisify(gunzipCallback);

export function gunzipStream(inStream: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
    // https://github.com/101arrowz/fflate/wiki/FAQ#how-do-i-use-fflate-with-data-uploaded-by-a-user
    const fflateStream = new AsyncGunzip();

    let canceled = false;
    const outStream = new ReadableStream<Uint8Array>({
        start(controller) {
            fflateStream.ondata = (err, chunk, final) => {
                if (err) {
                    controller.error(err);
                    canceled = true;
                } else {
                    controller.enqueue(chunk);
                    if (final) controller.close();
                }
            };
        },
        cancel() {
            canceled = true;
        },
        type: 'bytes'
    });

    (async () => {
        for await (const chunk of stream2iterator(inStream)) {
            if (canceled) return;
            fflateStream.push(chunk);
        }
        if (canceled) return;
        fflateStream.push(new Uint8Array(), true);
    })();

    return outStream;
}

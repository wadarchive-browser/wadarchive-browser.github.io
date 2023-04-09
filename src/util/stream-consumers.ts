/*! stream-consumers. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */

/**
 * Util fn to create iterator from web
 * ReadableStream that lacks Symbol.asyncIterator
 * @param iterable
 */
export function stream2iterator<R>(iterable: ReadableStream<R> | AsyncIterable<R>): AsyncIterable<R> {
    // Duck checking without actually depending on whatwg streams
    if (!(Symbol.asyncIterator in iterable) && iterable?.constructor?.name === 'ReadableStream') {
        return drain(iterable);
    }
    return iterable as AsyncIterable<R>;
}

async function* drain<R>(iterable: ReadableStream<R>) {
    const reader = iterable.getReader();
    while (true) {
        const chunk = await reader.read();
        if (chunk.done) return chunk.value;
        yield chunk.value;
    }
}

/**
 * Fulfills with an ArrayBuffer containing the full contents of the stream.
 * @param iterable
 */
export async function arrayBuffer<R extends ArrayBufferView & ArrayLike<number>>(iterable: ReadableStream<R> | AsyncIterable<R>): Promise<ArrayBufferLike> {
    let i = 0;
    const chunks = [];
    for await (const chunk of stream2iterator(iterable)) {
        i += chunk.byteLength;
        chunks.push(chunk);
    }

    const array = new Uint8Array(i);
    i = 0;
    for (const chunk of chunks) {
        array.set(chunk, i);
        i += chunk.byteLength;
    }
    return array.buffer;
}

/**
 * Fulfills with a <Blob> containing the full contents of the stream.
 * @param iterable
 */
export async function blob<R extends ArrayBufferView & ArrayLike<number>>(iterable: ReadableStream<R> | AsyncIterable<R>): Promise<Blob> {
    const chunks = [];
    for await (const chunk of stream2iterator(iterable)) {
        chunks.push(chunk);
    }
    return new Blob(chunks);
}

/**
 * Fulfills with the contents of the stream parsed as a UTF-8 encoded string.
 * @param {ReadableStream|AsyncIterable} iterable
 */
export async function text<R extends ArrayBufferView & ArrayLike<number>>(iterable: ReadableStream<R> | AsyncIterable<R>): Promise<string> {
    const str: string[] = [];
    const textDecoder = new TextDecoder();
    for await (const chunk of stream2iterator(iterable)) {
        str.push(typeof chunk === 'string'
            ? chunk
            : textDecoder.decode(chunk, { stream: true }));
    }
    str.push(textDecoder.decode()); // flush
    return str.join('');
}

/**
 * Fulfills with the contents of the stream parsed as a UTF-8
 * encoded string that is then passed through JSON.parse()
 * @param {ReadableStream|AsyncIterable} iterable
 */
export function json<R extends ArrayBufferView & ArrayLike<number>>(iterable: ReadableStream<R> | AsyncIterable<R>): Promise<unknown> {
    return text(iterable).then(JSON.parse);
}
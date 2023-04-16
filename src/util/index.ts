//! https://stackoverflow.com/a/14919494
/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export function humanizeFileSize(bytes: number, si = false, dp = 1) {
    const divisor = si ? 1000 : 1024;

    if (Math.abs(bytes) < divisor) {
        return bytes + ' B';
    }

    const units = si ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= divisor;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= divisor && u < units.length - 1);

    return `${bytes.toFixed(dp)} ${units[u]}`;
}

export function trimToLength(maxLength: number, text?: string): string {
    text ??= '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
}

export function aAn(string: string) {
    const startingLetter = string[0].toLowerCase();
    if (startingLetter == 'a' || startingLetter == 'e' || startingLetter == 'i' || startingLetter == 'o' || startingLetter == 'u') return 'an';
    return 'a';
}

export function convertAll<K extends string | number | symbol, V, RK extends string | number | symbol, RV>(object: Record<K, V>, mappingFunc: (k: K, v: V) => [k: RK, v: RV]): Record<RK, RV> {
    return Object.fromEntries(Object.entries(object).map(([k, v]) => mappingFunc(k as K, v as V))) as Record<RK, RV>;
}

export function convertKeys<K extends string | number | symbol, V, RK extends string | number | symbol>(object: Record<K, V>, mappingFunc: (k: K) => RK): Record<RK, V> {
    return Object.fromEntries(Object.entries(object).map(([k, v]) => [mappingFunc(k as K), v])) as Record<RK, V>;
}

export function convertValues<K extends string | number | symbol, V, RV>(object: Record<K, V>, mappingFunc: (v: V) => RV): Record<K, RV> {
    return Object.fromEntries(Object.entries(object).map(([k, v]) => [k, mappingFunc(v as V)])) as Record<K, RV>;
}

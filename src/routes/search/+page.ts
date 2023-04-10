import type { PageLoad } from './$types';

export const prerender = true;

export async function load({ url }) {
    return {
        query: url.searchParams.get('q')
    };
}

load satisfies PageLoad;
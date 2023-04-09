import type { PageLoad } from './$types';

export const ssr = false;

export async function load({ params }) {
    return {
        wadId: params.wadId
    };

    // throw error(404, 'Not found');
}

load satisfies PageLoad;
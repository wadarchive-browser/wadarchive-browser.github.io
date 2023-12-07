// https://archive.org/download/wadarchive/DATA/f1.zip/f1%2Fcb204c90119c4298c8a87933e90cfa91a02d34%2Ff1cb204c90119c4298c8a87933e90cfa91a02d34.wad.gz

import { WadType, type Endoom, type Graphic, type Map, type Wad } from './msgpack-models';

// Input: f1cb204c90119c4298c8a87933e90cfa91a02d34/f1cb204c90119c4298c8a87933e90cfa91a02d34.wad.gz
// Output: https://archive.org/download/wadarchive/DATA/f1.zip/f1%2Fcb204c90119c4298c8a87933e90cfa91a02d34%2Ff1cb204c90119c4298c8a87933e90cfa91a02d34.wad.gz
export function formatArchivedBlobPath(path: string) {
    return `https://archive.org/download/wadarchive/DATA/${path.slice(0, 2)}.zip/${encodeURIComponent(`${path.slice(0,2)}/${path.slice(2)}`)}`;
}

export function getCdnUrl(url: string) {
    return 'https://wsrv.nl/?' + new URLSearchParams({ url, af: '', l: '9', output: 'png', w: '800', h: '600', we: '' });
}

const wadTypeToExtension: Record<WadType, string> = { // wad|pk3|pk7|pkz|epk|pke
    [WadType.IWAD]: 'wad',
    [WadType.PWAD]: 'wad',
    [WadType.PK3]: 'pk3',
    [WadType.PK7]: 'pk7',
    [WadType.ZWAD]: 'wad',
    [WadType.WAD2]: 'wad',
    [WadType.WAD3]: 'wad',
    [WadType.PKZ]: 'pkz',
    [WadType.EPK]: 'epk',
    [WadType.PKE]: 'pke',
    [WadType.UNKNOWN]: 'wad'
};

export function formatWadDownloadPath(wad: Wad) {
    return formatArchivedBlobPath(`${wad.Id}/${wad.Id}.${wadTypeToExtension[wad.Type]}.gz`);
}

export function formatPalettePath(wad: Wad, palette: string) {
    return formatArchivedBlobPath(`${wad.Id}/PALETTES/${palette}`);
}

export function formatGraphicPath(wad: Wad, graphic: Graphic) {
    return formatArchivedBlobPath(`${wad.Id}/GRAPHICS/${graphic.Image}`);
}

export function formatEndoomPath(wad: Wad, endoom: Endoom) {
    return formatArchivedBlobPath(`${wad.Id}/ENDOOM/${endoom.Filename}`);
}

export function formatMapScreenshot(wad: Wad, map: Map) {
    return formatArchivedBlobPath(`${wad.Id}/SCREENSHOTS/${map.Screenshot}`);
}

export function formatMapAutomap(wad: Wad, map: Map) {
    return formatArchivedBlobPath(`${wad.Id}/MAPS/${map.Name}.PNG`);
}
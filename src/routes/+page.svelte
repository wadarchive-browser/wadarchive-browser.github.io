<style>
    section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 0.6;
    }

    h1 {
        width: 100%;
        text-align: center;
    }
</style>

<svelte:head>
    <title>Wad Archive</title>
    <meta name="description" content="Wad Archive Mirror - Home" />
</svelte:head>

<section>
    <h1>Welcome to the Wad Archive Mirror</h1>

    <p>
        This is an unofficial mirror of <a href="https://www.wad-archive.com/" target="_blank" rel="noopener noreferrer">wad-archive.com</a>.
        No new WADs can be uploaded, but you can browse all existing uploads up until the site's shutdown here.
    </p>

    <p>
        Still need your Doom fix? Checkout the <a href="https://www.doomworld.com/" target="_blank" rel="noopener noreferrer">Doomworld forums</a>
        or the <a href="https://doomwiki.org/" target="_blank" rel="noopener noreferrer">Doom Wiki</a>.
    </p>

    <p>
        Changelog:
        <ul>
            <li>Feb 22, 2024: Backend fixes, improved styles, added support for displaying lumps</li>
            <li>Dec 7, 2023: Use wsrv.nl as CDN for serving images</li>
            <li>Apr 10, 2023: Added search functionality</li>
            <li>Apr 9, 2023: Initial release</li>
        </ul>
</section>

<script lang="ts">
    import { Container, Row, Col, Icon, Card, Modal } from "sveltestrap";
    import { formatGraphicPath, formatMapScreenshot, formatPalettePath, formatWadDownloadPath, formatMapAutomap, formatEndoomPath } from "../../../util/ia-url-formatter";
    import type { PageData } from "./$types";
    import MapComponent from "../../../components/MapComponent.svelte";
    import type { Endoom, Map, NiceNames, Wad, WadType } from "../../../util/msgpack-models";
    import { queryWad } from "../../../util/wad-lookup";
    import details from "$lib/images/details.png";
    import { aAn, humanizeFileSize, trimToLength } from "../../../util";

    export let data: PageData;

    let modalEndoom: [endoom: Endoom, mode: "text" | "image"] | undefined;

    let modalMap: Map | undefined;

    const promise = (async () => {
        const wads = await queryWad(data.wadId);
        const wad = wads[0];

        const title = wad.Name
            ?? wad.FallbackNames[0]
            ?? wad.Filename
            ?? wad.Readmes.map(e => e.match(/^\btitle[ \t]*:[ \t]*(.*)$/im)?.[1]?.trim()).find(e => e != null)
            ?? wad.FallbackFilenames[0];

        let mainScreenshot: string | null = null;

        const titlepic = wad.Graphics.find(e => e.Name == "TITLE");
        if (titlepic) mainScreenshot = formatGraphicPath(wad, titlepic);
        else if (wad.Maps[0]?.Screenshot) mainScreenshot = formatMapScreenshot(wad, wad.Maps[0]);
        else if (wad.Graphics.length > 0) mainScreenshot = formatGraphicPath(wad, wad.Graphics[0]);

        let formattedDescription: string;
        if (wad.Description ?? wad.FallbackDescriptions?.[0]) {
            formattedDescription = wad.Description ?? wad.FallbackDescriptions?.[0]!;
        } else {
            formattedDescription = wad.Filename ?? wad.FallbackFilenames[0];
            if (wad.Name ?? wad.FallbackNames[0]) {
                formattedDescription += ` (${wad.Name ?? wad.FallbackNames[0]})`;
            }
            formattedDescription += ` is ${aAn(wad.Type)} ${wad.Type}`;

            if (wad.Engines.length) {
                formattedDescription += ` for ${wad.Engines.join(", ")}`;
            }

            if (wad.Maps.length) {
                formattedDescription += ` featuring ${wad.Maps.length} maps (${wad.Maps.map(e => e.NiceNames?.LevelName ?? e.FallbackNiceNames?.[0].LevelName ?? e.Name).join(", ")})`;
            }
        }

        return {
            ...wad,
            title,
            mainScreenshot,
            formattedDescription: trimToLength(500, formattedDescription),
        };
    })();
</script>

<style>
    .graphicsimage,
    .endoomthumb {
        width: 100%;
    }
    .automapimage,
    .endoomimage {
        max-width: 100%;
    }

    .endoomtext {
        -webkit-appearance: none;
        appearance: none;
        padding: 0;
        border: none;
        display: inline-block;
        background: none;
    }
    .endoomtext > img {
        width: 20px;
        height: 20px;
        vertical-align: middle;
    }
</style>

<svelte:head>
    {#await promise}
        <title>Wad Archive</title>
    {:then wad}
        <title>{wad.title} - Wad Archive</title>
    {/await}
</svelte:head>

{#await promise}
    <h5><i>Loading... Make sure JavaScript is enabled.</i></h5>
{:then wad}
    <h1>{wad.title}</h1>

    <Container>
        <Row>
            <Col>
                <Row>
                    {#if wad.Filename}
                        <Col xs="2">Filename</Col>
                        <Col><code>wad.Filename</code></Col>
                    {:else}
                        <Col xs="2">Filenames</Col>
                        <Col
                            >{#each wad.FallbackFilenames as filename, i}{i != 0 ? ";" : ""} <code>{filename}</code>{/each}</Col
                        >
                    {/if}
                </Row>
                <Row>
                    <Col xs="2">Size</Col>
                    <Col>{humanizeFileSize(Number(wad.Size))}</Col>
                </Row>
                <Row>
                    <Col xs="2">MD5</Col>
                    <Col>{wad.Md5 ?? "Unknown"}</Col>
                </Row>
                <Row>
                    <Col xs="2">SHA-1</Col>
                    <Col>{wad.Sha1 ?? "Unknown"}</Col>
                </Row>
                <Row>
                    <Col xs="2">SHA-256</Col>
                    <Col>{wad.Sha256 ?? "Unknown"}</Col>
                </Row>
                <Row>
                    <Col xs="2">WAD Type</Col>
                    <Col>{wad.Type ?? "Unknown"}</Col>
                </Row>
                <Row>
                    <Col xs="2">IWAD</Col>
                    <Col>
                        {#each wad.Iwads as iwad, i}{i != 0 ? "," : ""} <code>{iwad}</code>{/each}
                        {#if wad.Iwads.length == 0}
                            Unknown
                        {/if}
                    </Col>
                </Row>
                <Row>
                    <Col xs="2">Engines</Col>
                    <Col>
                        {#each wad.Engines as engine, i}{i != 0 ? "," : ""} {engine}{/each}
                        {#if wad.Engines.length == 0}
                            Unknown
                        {/if}
                    </Col>
                </Row>
                <Row>
                    <Col xs="2">Lumps</Col>
                    <Col>{wad.CountsLumps}</Col>
                </Row>
                {#if wad.Maps.length}
                <Row>
                    <Col xs="2">Maps</Col>
                    <Col>{#each wad.Maps as map, i}{i != 0 ? "," : ""} <a href="#{map.Name}">{map.Name}</a>{/each}</Col>
                </Row>
                {/if}
            </Col>
            <Col xs="4" style="text-align: center">
                {#if wad.mainScreenshot}
                    <div>
                        <img class="main-image" alt={wad.title} src={wad.mainScreenshot} />
                    </div>
                {/if}
                {wad.formattedDescription}
            </Col>
        </Row>
    </Container>

    {#if wad.CanDownload}
        <h2>Download</h2>
        <a rel="nofollow" href={formatWadDownloadPath(wad)}><Icon style="color: white" name="download" /> Download <em>{wad.title}</em> from Wad Archive (Internet Archive mirror)</a>
    {/if}

    {#if wad.Maps.length}
        <h2>Maps</h2>
        <Container>
            <Row cols={{ xs: 1, sm: 2 }}>
                {#each wad.Maps as map}
                    <Col id={map.Name}>
                        <MapComponent {wad} {map} openAutomapCallback={() => (modalMap = map)} />
                    </Col>
                {/each}
            </Row>
        </Container>
    {/if}

    {#if wad.Graphics.length}
        <h2>Graphics</h2>
        <Container>
            <Row cols={{ xs: 2, lg: 4 }}>
                {#each wad.Graphics as graphic}
                    <Col>
                        <Card body inverse class="mb-4">
                            <a href={formatGraphicPath(wad, graphic)} style="text-align: center">
                                <div>
                                    <img class="graphicsimage" alt={graphic.Name} src={formatGraphicPath(wad, graphic)} />
                                </div>
                                {graphic.Name}
                            </a>
                        </Card>
                    </Col>
                {/each}
            </Row>
        </Container>
    {/if}

    {#if wad.Endooms.length}
        <h2>Endoom</h2>
        <Container>
            <Row cols={{ xs: 2, lg: 4 }}>
                {#each wad.Endooms as endoom}
                    <Col>
                        <Card body inverse class="mb-4">
                            <a href={formatEndoomPath(wad, endoom)} on:click|preventDefault={() => (modalEndoom = [endoom, "image"])} style="text-align: center">
                                <img class="endoomthumb" alt={endoom.Name} src={formatEndoomPath(wad, endoom)} />
                            </a>
                            <div style="text-align: center">
                                <a href={formatEndoomPath(wad, endoom)} class="automap" target="_blank" on:click|preventDefault={() => (modalEndoom = [endoom, "image"])}>{endoom.Name}</a>
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                <button class="endoomtext" title="Show as text" on:click|preventDefault={() => (modalEndoom = [endoom, "text"])}>
                                    <img src={details} alt="Show as text" />
                                </button>
                            </div>
                        </Card>
                    </Col>
                {/each}
            </Row>
        </Container>
    {/if}

    {#if Object.keys(wad.Palettes).length > 0}
        <h2>Color Palettes</h2>
        {#each Object.entries(wad.Palettes) as [palette, paletteImages]}
            <h3>{palette}</h3>

            <Row cols={{ xs: 1, sm: 2, md: 4 }}>
                {#each paletteImages as paletteImage}
                    <Col>
                        <Card body class="mb-4">
                            <img alt={paletteImage} src={formatPalettePath(wad, paletteImage)} />
                        </Card>
                    </Col>
                {/each}
            </Row>
        {/each}
    {/if}

    <pre>{JSON.stringify(wad, null, 4)}</pre>
    <!--<div>{@html data.content}</div>-->

    {#if wad.Maps.length}
        <Modal body header="Automap for {modalMap?.Name ?? 'Map'}" isOpen={modalMap != null} toggle={() => (modalMap = undefined)} size="xl">
            {#if modalMap?.HasAutomapImage}
                <img alt="Automap for {modalMap?.Name ?? 'Map'}" src={formatMapAutomap(wad, modalMap)} class="automapimage" />
            {/if}
        </Modal>
    {/if}

    {#if wad.Endooms.length}
        <Modal body header="Endoom" isOpen={modalEndoom != null} toggle={() => (modalEndoom = undefined)} size="xl">
            {#if modalEndoom?.[1] == "text"}
                <pre style="text-align: center; line-height: normal;">{modalEndoom[0].Text}</pre>
            {:else if modalEndoom?.[1] == "image"}
                <img alt="Endoom" class="endoomimage" src={formatEndoomPath(wad, modalEndoom[0])} />
            {/if}
        </Modal>
    {/if}
{:catch err}
    <p>Failed to load required data. Error details:</p>
    <pre>{err}</pre>
{/await}

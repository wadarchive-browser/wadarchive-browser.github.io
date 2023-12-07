<script lang="ts">
    import { Container, Row, Col, Icon, Card } from "sveltestrap";
    import type { Map, Wad } from "../util/msgpack-models";
    import { formatMapAutomap, formatMapScreenshot, getCdnUrl } from "../util/ia-url-formatter";

    export let wad: Wad;
    export let map: Map;
    export let openAutomapCallback: () => void;

    const niceName = map.NiceNames?.LevelName ?? map.FallbackNiceNames[0]?.LevelName ?? map.Name;
</script>

<style>
    .mapimage {
        width: 100%;
    }
    .automap {
        background: url($lib/images/automap.png) no-repeat;
        background-size: 20px 20px;
        text-indent: 25px;
        height: 20px;
        display: inline-block;
    }
</style>

<Card body inverse class="mb-3">
    <Row cols={{xs: 1, md: 2}}>
        <Col>
            {#if map.Screenshot}
            <img
                class="mapimage"
                title={niceName}
                alt={niceName}
                src={getCdnUrl(formatMapScreenshot(wad, map))}
            />
            {/if}
        </Col>
        <Col>
            <h5>{niceName} ({map.Name})</h5>
            <Row cols="2" noGutters>
                <Col xs="8">Deathmatch Spawns</Col>
                <Col xs="4">{map.DeathmatchSpawns}</Col>
            </Row>
            <Row cols="2" noGutters>
                <Col xs="8">Co-op Spawns</Col>
                <Col xs="4">{map.CoopSpawns}</Col>
            </Row>
            {#if map.HasAutomapImage}
            <a href={getCdnUrl(formatMapAutomap(wad, map))} class="automap" target="_blank" rel="noreferrer" on:click|preventDefault={openAutomapCallback}>View Automap</a>
            {/if}
        </Col>
    </Row>
</Card>

<script lang="ts">
    import { Card, CardHeader, CardTitle, CardBody, CardSubtitle, CardText, Button, CardFooter } from "@sveltestrap/sveltestrap";
    import { WadFuzzy, searchWads, type SearchResult } from "../../util/wad-search";
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { never } from "../../util/promise";
    import { Jumper } from "../../components/spinners";

    let searchResults: Promise<SearchResult & { query: string }> = never;

    onMount(() => {
        searchResults = (async () => {
            const query = $page.url.searchParams.get('q');
            if (!query) return {query: '', count: 0, results: []};
            return {
                ...await searchWads(query, 250),
                query
            };
        })();
    });
</script>

<style>
    .resultlink {
        color: inherit;
        text-decoration: none;
    }
</style>

<svelte:head>
    <title>Search</title>
    <meta name="description" content="Search" />
    <!--<script async src="https://cse.google.com/cse.js?cx=a69bfdd3beb524c56"></script>-->
</svelte:head>

<!--<div class="gcse-search" />-->

{#await searchResults}
    <Jumper size="60" color="var(--bs-code-color)" unit="px" duration="1.5s" />
{:then results}
    <p>
        <b>Found {results.count} matches for "{results.query}" {#if results.count > 250}(displaying top 250 matches){/if}</b><br>
        Not what you were looking for? Try <a href="/googlesearch?q={encodeURIComponent(results.query)}">searching with Google</a>
    </p>
    {#each results.results as result}
        <a href="/wad?id={result.Id}" class="resultlink">
            <Card class="mb-3">
                <CardHeader>
                    {#if result.Names[0]}
                        <CardTitle>{result.Names[0]} ({result.Filenames[0]})</CardTitle>
                    {:else}
                        <CardTitle>{result.Filenames[0]}</CardTitle>
                    {/if}
                </CardHeader>
                <CardBody>
                    <CardText>
                        {#if result.Names.length > 1}
                        Alternative titles: {result.Names.slice(1).join('; ')}<br>
                        {/if}
                        {#if result.Filenames.length > 1}
                        Alternative file names:
                        {#each result.Filenames.slice(1) as filename, i}{i != 0 ? ";" : ""} <code>{filename}</code>{/each}<br>
                        {/if}
                        ID / SHA-1: <code>{result.Id}</code><br>
                        {#if result.Md5}
                        MD5: <code>{result.Md5}</code><br>
                        {/if}
                        {#if result.Sha256}
                        SHA-256: <code>{result.Sha256}</code><br>
                        {/if}
                    </CardText>
                </CardBody>
            </Card>
        </a>
    {/each}
{:catch err}
    <p>Failed to load required data. Error details:</p>
    <pre>{err}</pre>
{/await}

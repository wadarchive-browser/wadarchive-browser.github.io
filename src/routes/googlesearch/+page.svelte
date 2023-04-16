<script lang="ts">
    import { onMount } from "svelte";

    onMount(() => {
        window.__gcse = {
            parsetags: 'explicit',
            initializationCallback() {
                if (document.readyState === "complete") {
                    google.search.cse.element.render({
                        div: "googlesearch",
                        tag: "search",
                        gname: "gsearch",
                    });
                } else {
                    google.setOnLoadCallback(function () {
                        google.search.cse.element.render({
                            div: "googlesearch",
                            tag: "search",
                            gname: "gsearch",
                        });
                    }, true);
                }
            },
        };
    });
</script>

<svelte:head>
    <title>Search</title>
    <meta name="description" content="Search" />
    <script async src="https://cse.google.com/cse.js?cx=a69bfdd3beb524c56"></script>
</svelte:head>

<div id="googlesearch" />

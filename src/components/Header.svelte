<script lang="ts">
    import { page } from "$app/stores";
    import { Button, Col, Form, FormGroup, Input, Label, Nav, NavItem, NavLink, Row } from "@sveltestrap/sveltestrap";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

    let searchTerm: string;

    onMount(() => {
        if ($page.route.id === '/search') {
            searchTerm = $page.url.searchParams.get('q') ?? '';
        }
    })
</script>

<style lang="scss">
    //header {
    //    display: flex;
    //    justify-content: space-between;
    //}

    :global(.nav) {
        padding: 4px !important;
    }

    :global(.search-col) {
        margin-right: 2px !important;
    }

    :global(#searchWad) {
        color: rgb(209, 205, 199) !important;
        background-color: rgb(24, 26, 27) !important;
        border-color: rgb(48, 52, 54) !important;
        padding: var(--bs-nav-link-padding-y) var(--bs-nav-link-padding-x) !important;
    }

    :global(.search-btn) {
        padding-top: calc(var(--bs-nav-link-padding-y) - 1px) !important;
        padding-bottom: calc(var(--bs-nav-link-padding-y) - 1px) !important;
        padding-left: calc(var(--bs-nav-link-padding-x) - 1px) !important;
        padding-right: calc(var(--bs-nav-link-padding-x) - 1px) !important;
    }
</style>

<header>
    <Nav>
        <NavItem>
            <NavLink href="/">Home</NavLink>
        </NavItem>
        <NavItem>
            <Form on:submit={e => (e.preventDefault(), goto('/search?' + new URLSearchParams({q: searchTerm})))} inline>
                <Row class="gx-1">
                    <Col class="search-col">
                        <Input
                            type="search"
                            name="search"
                            id="searchWad"
                            placeholder="hdoom.pk3"
                            bind:value={searchTerm}
                        />
                    </Col>
                    <Col>
                        <Button type="submit" class="search-btn">Search</Button>
                    </Col>
                </Row>
            </Form>
        </NavItem>
    </Nav>
</header>

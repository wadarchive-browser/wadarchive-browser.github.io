<script lang="ts">
    import { page } from "$app/stores";
    import { Button, Col, Form, FormGroup, Input, Label, Nav, NavItem, NavLink, Row } from "sveltestrap";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

    let searchTerm: string;

    onMount(() => {
        if ($page.route.id === '/search') {
            searchTerm = $page.url.searchParams.get('q') ?? '';
        }
    })
</script>

<style>
    header {
        display: flex;
        justify-content: space-between;
    }
</style>

<header>
    <Nav>
        <NavItem>
            <NavLink href="/">Home</NavLink>
        </NavItem>
        <NavItem>
            <Form on:submit={e => (e.preventDefault(), goto('/search?' + new URLSearchParams({q: searchTerm})))}>
                <Row class="gx-1">
                    <Col>
                        <Input
                            type="search"
                            name="search"
                            id="searchWad"
                            placeholder="hdoom.pk3"
                            bind:value={searchTerm}
                        />
                    </Col>
                    <Col>
                        <Button type="submit">Search</Button>
                    </Col>
                </Row>
            </Form>
        </NavItem>
    </Nav>
</header>

<script lang="ts">
    import { page } from "$app/stores";
    import logo from "$lib/images/svelte-logo.svg";
    import github from "$lib/images/github.svg";
    import { Button, Col, Form, FormGroup, Input, Label, Nav, NavItem, NavLink, Row } from "sveltestrap";
    import { goto } from "$app/navigation";

    let searchTerm: string;
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
                            placeholder="hdoom.wad"
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

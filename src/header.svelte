<script>
    import TopAppBar, { Row, Section, Title } from "@smui/top-app-bar"
    import { Link } from "svelte-navigator"
</script>


<div class="flexy">
    <div class="top-app-bar-container">
        <TopAppBar variant="static">
            <Row>
                <Section>
                    <Title>Houme Admin</Title>
                </Section>
                <Section align="end">
                    <nav>
                        <Link to="/">Home</Link>
			            <Link to="view">View</Link>
                    </nav>
                </Section>
            </Row>
        </TopAppBar>
    </div>
</div>

<style>
</style>
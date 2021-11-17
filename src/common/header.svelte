<script>
    import TopAppBar, { Row, Section, Title } from "@smui/top-app-bar";
    import IconButton from "@smui/icon-button";
    import { Icon } from "@smui/common";
</script>

<div class="flexy">
    <div class="top-app-bar-container">
        <TopAppBar variant="static">
            <Row>
                <Section>
                    <IconButton href="/"><Icon class="material-icons">house</Icon></IconButton>
                    <Title href="/">Houmly Admin</Title>
                </Section>
            </Row>
        </TopAppBar>
    </div>
</div>

<style>
    .top-app-bar-container button {
        margin: 0;
    }
</style>
<script>
    import TopAppBar, { Row, Section, Title } from "@smui/top-app-bar";

    export let title;
</script>

<div class="flexy">
    <div class="top-app-bar-container">
        <TopAppBar class="header" variant="static">
            <Row>
                <a class="header-logo-link" target="_blink" href="https://houmly.com">
                    <img class="header-logo" src="/houmly-logo.png" alt="Houmly logo"/>
                </a>
                <Section style="justify-content: center;">
                    <Title class="page-title">{title}</Title>
                </Section>
            </Row>
        </TopAppBar>
    </div>
</div>

<style>
    :global(.top-app-bar-container .header) {
        background-color: #fff;
        height: 80px;
        border-bottom: 1px solid #e0e1e2;
    }

    :global(.page-title) {
        color: rgba(21, 40, 89);
        text-transform: uppercase; 
        padding-left: 0;
    }

    .header-logo, .header-logo-link {
        width: 200px;
        height: 40px;
    }

    .header-logo-link {
        position: absolute;
        z-index: 10;
        display: block;
        top: 7px;

        /*content padding - header padding*/
        margin-left: calc(100px - 16px);
    }
</style>
<script>
    import TopAppBar, { Row, Section } from "@smui/top-app-bar";
    import { navigate } from "svelte-navigator";
    import { Icon } from '@smui/common';
    import Button, { Label } from "@smui/button";
    import { pageTitle, projectStored } from '../store';

    export let projectName = '';
    pageTitle.subscribe(value => {
        projectName = value.projectName;
	});
</script>

<div class="flexy">
    <div class="top-app-bar-container">
        <TopAppBar class="header" variant="static">
            <Row>
                <Section style="align-items: center;">
                    <a class="header-logo-link" target="_blink" href="https://houmly.com">
                        <img class="header-logo" src="/houmly-logo.png" alt="Houmly logo"/>
                    </a>
                    {#if !!projectName}
                    <Button class="project-dashboard-link" style="color: rgba(21, 40, 89, .7);margin-bottom: 0;margin-left: 20px;" on:click={() => navigate('/',{replace: true})}>
                        <Label><h2>Project Dashboard</h2></Label>
                    </Button>
                    <Icon style="color: rgba(21, 40, 89); font-size: 20px;" class="material-icons">chevron_right</Icon>
                    <h2 class="project-name">{projectName}</h2>
                    {/if}
                </Section>
                <Section>
                    
                </Section>
            </Row>
        </TopAppBar>
    </div>
</div>

<style>
    :global(.top-app-bar-container .header) {
        background-color: #fff;
        height: 64px;
        border-bottom: 1px solid #e0e1e2;
        padding: 0 16px;
    }

    :global(.top-app-bar-container h2) {
        font-size: 16px !important;
    }

    :global(.project-dashboard-link:hover) {
        color: rgba(21, 40, 89) !important;
    }

    h2.project-name {
        color: rgba(21, 40, 89);
        text-transform: uppercase;
        margin-left: 10px;
    }

    .header-logo, .header-logo-link {
        width: 165px;
        height: 33px;
    }

    .header-logo-link {
        display: block;
    }
</style>
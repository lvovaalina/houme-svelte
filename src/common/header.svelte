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
                    <Button style="color: rgba(21, 40, 89);margin-bottom: 0;margin-left: 20px;" on:click={() => navigate('/',{replace: true})}>
                        <Label><h2>Project Dashboard</h2></Label>
                    </Button>
                    <Icon style="color: rgba(21, 40, 89)" class="material-icons">chevron_right</Icon>
                    <Button
                        style="color: rgba(21, 40, 89);margin-bottom: 0;"
                        on:click={() => navigate('/view/' + $projectStored.projectId + '/model',{replace: true})}>
                        <Label><h2>{projectName}</h2></Label>
                    </Button>
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
        display: block;
    }
</style>
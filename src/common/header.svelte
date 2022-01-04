<script>
    import TopAppBar, { Row, Section } from "@smui/top-app-bar";
    import { navigate, Link } from "svelte-navigator";
    import Button, { Label } from "@smui/button";
    import { pageTitle, adminStored, adminAuthentificated } from '../store';

    export let projectName = '';
    pageTitle.subscribe(value => {
        projectName = value.projectName;
	});

    import { config } from '../config';
    let conf = new config();

    let admin = {};
    adminStored.subscribe(value => {
        admin = value;
    });

    async function logout() {
        fetch(conf.api + '/auth/logout',
        {
            method: 'POST',
            credentials: 'include',
        })
        .then((result) => {
            if (result.ok) {
                console.log("Successfully refreshed token");
            }

            return result.json();
        })
        .then(data => {
            if (data.code == 200) {
                adminStored.set({});
                adminAuthentificated.set(false);
            } else {
                isLoggedIn = false;
            }
        })
    }
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
                        <Link class="project-dashboard-link" 
                            style="color: rgba(21, 40, 89, .7);margin-bottom: 0;margin-left: 20px;"
                            to="/">
                            <h2>Project Dashboard</h2>
                        </Link>
                        <div
                            class="dashboard-link">
                            <i style="border-color: rgba(21, 40, 89, .7);padding: 3px;" class="arrow right"></i>
                        </div>
                        <h2 class="project-name">{projectName}</h2>
                    {/if}
                </Section>
                <Section style="justify-content:flex-end">
                    {#if !!admin && !!admin.email}
                    <div class="user-info">
                        <div>{admin.email}</div>
                        <Button variant="outlined" style="margin-bottom:0; margin-left:20px;" on:click={logout}>
                            <Label>Logout</Label>
                        </Button>
                    </div>
                    {/if}
                </Section>
            </Row>
        </TopAppBar>
    </div>
</div>

<style>
    .user-info {
        color: rgba(21, 40, 89, .7);
        display: flex;
        align-items: center;
    }

    :global(.dashboard-link) {
        border-color: rgba(21, 40, 89, 0.7);
        padding: 3px;
        margin-bottom: 2px;
    }

    :global(.user-info .mdc-button__label) {
        color: rgba(21, 40, 89, .7);
    }

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

    :global(.project-dashboard-link h2) {
        text-transform: uppercase;
        margin-right: 8px;
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

    @media only screen and (max-width:839px)
    {
        :global(.top-app-bar-container .header) {
            height: 38px;
            padding: 0 12px;
        }

        :global(.project-dashboard-link, .dashboard-icon, .project-name) {
            display: none;
        }

        .header-logo, .header-logo-link {
            width: 120px;
            height: 24px;
        }
    }
</style>
<script>
    import TopAppBar, { Row, Section } from "@smui/top-app-bar";
    import { Link, navigate } from "svelte-navigator";
    import Button, { Label } from "@smui/button";
    import { pageTitle, adminStored, adminAuthentificated } from '../store';
    import { _, locale, setupI18n } from '../services/i18n';

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

    function changeLanguage(lang) {
        if ($locale != lang) {
            let path = window.location.pathname;
            if (lang == 'en') {
                path = '/en' + (path == '/' ? '' : path);
            } else {
                path = path.replace('/en', '');
            }

            setupI18n({withLocale: lang});
            window.location = window.location.origin + path;
        }
    }

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
                <Section class="header-section" style="align-items: center;">
                    <a class="header-logo-link" target="_blink" href="https://houmly.com">
                        <img class="header-logo" src="/houmly-logo.png" alt="Houmly logo"/>
                    </a>
                    {#if !!projectName}
                        <Link class="project-dashboard-link" 
                            style="color: rgba(0, 0, 0, .55);margin-bottom: 0;margin-left: 20px;"
                            to={$locale == 'en' ? "/en/" : ""}>
                            <h2>{$_("header.dashboard")}</h2>
                        </Link>
                        <div class="project-arrow">
                            <i style="border-color: rgba(0, 0, 0, .55);padding: 3px;" class="arrow right"></i>
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
                    {:else}
                    <a class="contact-link" href="https://houmly.com/contact">{$_('header.contact')}</a>

                    <p class={"lang-label " + ($locale == 'en' ? 'active' : '')}
                        on:click={() => changeLanguage('en')}>
                        EN
                    </p>
                    <p class={"lang-label " + ($locale == 'pl' ? 'active' : '')}
                        on:click={() => changeLanguage('pl')}>
                        PL
                    </p>
                     {#if !!projectName}
                            <div class="get-plan-link-container">
                                <Link to="/upload">Get Plan</Link>
                            </div>
                        {/if}
                    {/if}
                </Section>
            </Row>
        </TopAppBar>
    </div>
</div>

<style>
    .get-plan-link-container {
        height: 38px;
        border: 1px solid rgba(0,100,200);
        border-radius: 5px;
        background-color:  rgba(0,100,200);
        margin-left: 15px;
    }

    :global(.get-plan-link-container a) {
        color: white;
        text-decoration: none;
        display: flex;
        align-items: center;
        padding: 0 15px;
        height: 100%;
    }

    .lang-label {
        color: black;
        margin: 0 5px;
        cursor: pointer;
    }

    .lang-label.active {
        cursor: initial;
        color: rgba(0,100,200);
    }

    .lang-label.active:hover {
        color: rgba(0,100,200);
    }

    .contact-link {
        color: #000000;
        font-size: 16px;
        font-weight: 500;
        margin-right: 10px;
    }

    .contact-link:hover {
        color: #2d62e8;
    }

    .user-info {
        color: rgba(0,100,200, .7);
        display: flex;
        align-items: center;
    }

    :global(.project-arrow) {
        padding: 3px;
        margin-bottom: 2px;
    }

    :global(.user-info .mdc-button__label) {
        color: rgba(0,100,200, .7);
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
        color: #2D62E8 !important;
    }

    :global(.project-dashboard-link h2) {
        text-transform: uppercase;
        margin-right: 8px;
    }

    h2.project-name {
        color: #2D62E8;
        text-transform: uppercase;
        margin-left: 10px;
    }

    .header-logo, .header-logo-link {
        width: 144x;
        height: 33px;
    }

    .header-logo-link {
        display: block;
    }

    @media only screen and (max-width:839px)
    {
        :global(.header-section) {
            padding-left: 0;
        }
        :global(.top-app-bar-container .header) {
            height: 38px;
            padding: 0 12px;
        }

        :global(.project-dashboard-link, .dashboard-icon, .project-name, .project-arrow) {
            display: none;
        }

        .header-logo, .header-logo-link {
            width: 105px;
            height: 24px;
        }
    }
</style>
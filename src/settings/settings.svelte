<script>
    import { onMount } from "svelte";
    import { pageTitle, adminAuthentificated, adminStored } from '../store';

    import JobCosts from "./job-costs.svelte";
    import JobMaterials from "./job-materials.svelte";
    import Projects from "./projects.svelte";
    import Login from './login.svelte';

    import { getNotificationsContext } from 'svelte-notifications';
    const { addNotification } = getNotificationsContext();
    import { config } from '../config';
    let conf = new config();
    
    let reload = false;
    function reloadProjectsTable() {
        reload = !reload;
    }

    let isLoggedIn = false;

    function updateProjects() {
        fetch(conf.api + '/auth/updateProjects',
        {
            method: 'PUT',
            credentials: 'include',
        })
        .then((result) => {
            if (result.ok) {
                console.log("Updated job projects successfully");
            }

            return result.json();
        })
        .then(data => {
            if (data.success) {
                reloadProjectsTable();
            }
        })
        .error(err => {
            addNotification({
                id: Date.now(),
                text: 'Project update failed ' + err,
                position: 'top-center',
                type: 'danger',
            });
        });
    }

    onMount(() => {
        fetch(conf.api + '/auth/refresh_token',
        {
            method: 'GET',
            credentials: 'include',
        })
        .then((result) => {
            if (result.ok) {
                console.log("Successfully refreshed token");
            }

            return result.json();
        })
        .then(data => {
            adminAuthentificated.set(data.code == 200);
        })
        .catch(err => {
            console.log(err);
            addNotification({
                id: Date.now(),
                text: 'Token update failed ' + err,
                position: 'top-center',
                type: 'danger',
            });
        });
        pageTitle.set({
            title: 'Settings'
        });

        adminAuthentificated.subscribe(isAdminAuthentificated => {
            isLoggedIn = isAdminAuthentificated;
            if (isLoggedIn) {
                fetch(conf.api + '/auth/getAdminInfo', {credentials: 'include'})
                .then((result) => {
                    if (result.ok) {
                        console.log("Successfully fetched admin info");
                    }

                    return result.json();
                })
                .then(data => {
                    if (data.success) {
                        console.log(data);
                        adminStored.set({
                            email: data.data.Email
                        });
                    } else {
                        isLoggedIn = false;
                    }
                });
            }
        });
    })
</script>

<div class="settings-component">
    <h1>Settings</h1>

    {#if isLoggedIn}
        <Projects bind:reloadProj={reload}/>

        <button on:click={updateProjects}>UPDATE PROJECTS</button>

        <JobCosts on:reloadProjects={reloadProjectsTable} />

        <JobMaterials />
    {:else}
        <Login bind:isLoggedIn={isLoggedIn}></Login>
    {/if}

</div>

<style>
    .settings-component {
        padding: 0 24px;
    }
</style>

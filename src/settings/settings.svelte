<script>
    import { onMount } from "svelte";
    import { pageTitle } from '../store';

    import JobCosts from "./job-costs.svelte";
    import JobMaterials from "./job-materials.svelte";
    import Projects from "./projects.svelte";

    import { getNotificationsContext } from 'svelte-notifications';
    const { addNotification } = getNotificationsContext();
    import { config } from '../config';
    let conf = new config();
    
    let reload = false;
    function reloadProjectsTable() {
        reload = !reload;
    }

    function updateProjects() {
        fetch(conf.api + '/updateProjects',
        {
            method: 'PUT',
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
        pageTitle.set({
            title: 'Settings'
        });
    })
</script>

<div class="settings-component">
    <h1>Settings</h1>

    <Projects bind:reloadProj={reload}/>

    <button on:click={updateProjects}>UPDATE PROJECTS</button>

    <JobCosts on:reloadProjects={reloadProjectsTable} />

    <JobMaterials />

</div>

<style>
    .settings-component {
        padding: 0 24px;
    }
</style>

<script>
    import { onMount } from "svelte";
    import { pageTitle } from '../store';

    import JobCosts from "./job-costs.svelte";
    import JobMaterials from "./job-materials.svelte";
    import Projects from "./projects.svelte";
    
    let reload = false;
    function reloadProjectsTable() {
        reload = !reload;
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

    <JobCosts on:reloadProjects={reloadProjectsTable} />

    <JobMaterials />

</div>

<style>
    .settings-component {
        padding: 0 24px;
    }
</style>

<script>
    import JobCosts from "./job-costs.svelte";
    import JobMaterials from "./job-materials.svelte";
    import Projects from "./projects.svelte";
</script>

<div class="settings-component">
    <h1>Settings</h1>

    <Projects />

    <JobCosts />

    <JobMaterials />

</div>

<style>
    .settings-component {
        padding: 0 24px;
    }
</style>

<script>
    import Project from "./project.svelte";
    import LayoutGrid, { Cell } from "@smui/layout-grid"
    import Upload from "./upload.svelte";
    import { onMount } from 'svelte';

    const api = isProduction
        ? "https://houme-api.herokuapp.com/projects"
        : "http://localhost:10000/projects";
    
    export let projects = [];

    onMount(async function() {
        const response = await fetch(api);
        projects = await response.json();

        console.log(process.env);
    });

    export let BaseBucketName = "houme";

    function addProject(event) {
        if (event.detail) {
            const fileName = event.detail.fileName;
            let newProject = {
                fileName: fileName,
                bucketName: BaseBucketName
            }

            projects = projects.concat(newProject);
        }
    }
</script>

<div class="card-display">
    <LayoutGrid>
        {#each projects as project}
            <Cell>
                <Project
                    fileName="{project.fileName}"
                    bucketName="{project.bucketName}"
                    urn="{project.urn}"/>
            </Cell>
        {/each}
        <Cell>
            <Upload bucketName="{BaseBucketName}" on:add={addProject}/>
        </Cell>
    </LayoutGrid>   
</div>


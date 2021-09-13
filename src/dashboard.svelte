<script>
    import Project from "./project.svelte";
    import LayoutGrid, { Cell } from "@smui/layout-grid"
    import Upload from "./upload.svelte";
    import { onMount } from 'svelte';
    
    let apiURL = "https://houme-api.herokuapp.com/projects"
    export let projects = [];

    onMount(async function() {
        const response = await fetch(apiURL);
        projects = await response.json();
    });

    export let BaseBucketName = "houme";

    function addProject(event) {
        const fileName = event.detail;
        let newProject = {
            fileName: fileName,
            bucketName: BaseBucketName
        }

        projects = projects.concat(newProject);
    }
</script>

<div class="card-display">
    <LayoutGrid>
        {#each projects as project}
            <Cell>
                <Project fileName="{project.fileName}" bucketName="{project.bucketName}" urn="{project.urn}"/>
            </Cell>
        {/each}
        <Cell>
            <Upload bucketName="{BaseBucketName}" on:add={addProject}/>
        </Cell>
    </LayoutGrid>   
</div>


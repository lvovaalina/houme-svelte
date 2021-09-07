<script>
    import Project from "./project.svelte";
    import LayoutGrid, { Cell } from "@smui/layout-grid"
    export let projects = 
    [
        {fileName: "model.rvt", bucketName: "houme"},
        {fileName:"dfdf", bucketName: "houme"},
        {fileName: "model.rvt", bucketName: "houme"},
        {fileName:"dfdf", bucketName: "houme"},
        {fileName: "model.rvt", bucketName: "houme"},
        {fileName:"dfdf", bucketName: "houme"},
    ];
</script>

<div class="card-display">
    <LayoutGrid>
        {#each projects as project}
            <Cell>
                <Project fileName="{project.fileName}" bucketName="{project.bucketName}"/>
            </Cell>
        {/each}
    </LayoutGrid>   
</div>


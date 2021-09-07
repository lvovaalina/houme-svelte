<script>
    import Project from "./project.svelte";
    import LayoutGrid, { Cell } from "@smui/layout-grid"
    import Upload from "./upload.svelte";

    export let BaseBucketName = "houme";
    //export let newProjectName;
    export let projects = 
    [
        {fileName: "model.rvt", bucketName: BaseBucketName},
        {fileName:"dfdf", bucketName: BaseBucketName},
        {fileName: "model.rvt", bucketName: BaseBucketName},
        {fileName:"dfdf", bucketName: BaseBucketName},
        {fileName: "model.rvt", bucketName: BaseBucketName},
        {fileName:"dfdf", bucketName: BaseBucketName},
    ];

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
                <Project fileName="{project.fileName}" bucketName="{project.bucketName}"/>
            </Cell>
        {/each}
        <Cell>
            <Upload bucketName="{BaseBucketName}" on:add={addProject}/>
        </Cell>
    </LayoutGrid>   
</div>


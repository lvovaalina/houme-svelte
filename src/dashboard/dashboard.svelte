<script>
    import Project from "./project.svelte";
    import LayoutGrid, { Cell } from "@smui/layout-grid"
    import Upload from "./upload.svelte";
    import { onMount } from 'svelte';
    import { getNotificationsContext } from 'svelte-notifications';

    import AddProjectDialog from './add-project-dialog.svelte';

    import Button, { Label as ButtonLabel } from '@smui/button';
    export let openAddProjectDialog = false;

    const { addNotification } = getNotificationsContext();

    const api = isProduction
        ? "https://houme-api.herokuapp.com/projects"
        : "http://localhost:10000/projects";

    export let projects = [];

    onMount(async function() {
        const response = await fetch(api);
        projects = await response.json();
    });

    export let BaseBucketName = "houme";

    function addProject(event) {
        if (event.detail) {
            const fileName = event.detail.fileName;
            let isUpdated = false;

            projects.forEach(element => {
                if (element.fileName == fileName) {
                    isUpdated = true;
                    addNotification({
                        text: fileName + ' updated!',
                        position: 'top-center',
                    })
                }
            });

            if (!isUpdated) {
                let newProject = {
                    fileName: fileName,
                    bucketName: BaseBucketName
                }
                projects = projects.concat(newProject);
                addNotification({
                    text: fileName + ' added!',
                    position: 'top-center',
                });
            }
        }
    }

    function deleteProject(event) {
        if (event.detail) {
            const fileName = event.detail.fileName;

            projects = projects.filter(item => item.fileName != fileName);
            addNotification({
                text: fileName + ' deleted!',
                position: 'top-center',
            });
        }
    }
</script>

<div class="dashboard">
    <Button on:click={() => (openAddProjectDialog = true)}>
        <ButtonLabel>Add project</ButtonLabel>
    </Button>
    <div class="card-display">
        <LayoutGrid>
            {#each projects as project}
                <Cell>
                    <Project on:delete={deleteProject}
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
    <AddProjectDialog open={openAddProjectDialog}></AddProjectDialog>
</div>

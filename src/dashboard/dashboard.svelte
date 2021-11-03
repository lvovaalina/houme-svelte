<script>
    import LayoutGrid, { Cell } from "@smui/layout-grid"
    import Button, { Label as ButtonLabel } from '@smui/button';


    import { onMount } from 'svelte';
    import { getNotificationsContext } from 'svelte-notifications';

    import AddManageProjectDialog from '../common/add-manage-project-dialog.svelte';
    import DeleteProjectDialog from '../common/delete-project-dialog.svelte';
    import Upload from "./upload.svelte";
    import Project from "./project.svelte";

    export let openAddProjectDialog = false;
    export let deleteProjectDialogOpen = false;

    export let deletedProjectId = 0;

    const { addNotification } = getNotificationsContext();

    const api = isProduction
        ? "https://houme-api.herokuapp.com"
        : "http://localhost:10000";

    export let projects = [];

    onMount(function() {
        fetch(api + '/getProjects')
        .then((result) => {
            if (result.ok) {
                console.log("get projects successfully");
            }

            console.log(result);
            return result.json();
        })
        .then((resp) => {
            resp.data.forEach(element => {
                element.PropertyValue = null;
            });

            projects = resp.data;
        });
    });

    export let BaseBucketName = "houme";

    function addProject(event) {
        if (event.detail) {
            const project = event.detail.project;
            projects = projects.concat(project);
            addNotification({
                text: 'Project ' + project.Name + ' added!',
                position: 'top-center',
            });
        }
    }

    function deleteProject(event) {
        if (event.detail) {
            const projectId = event.detail.projectId;

            projects = projects.filter(item => item.ProjectId != projectId);
            addNotification({
                text: 'Project deleted!',
                position: 'top-center',
            });
        }
    }

    function openDeleteProjectDialog(event) {
        if (event.detail && event.detail.projectId) {
            deletedProjectId = event.detail.projectId;
            deleteProjectDialogOpen = true;
        }
    }
</script>

<div class="dashboard">
    <div class="page-header">
        <h1>Projects</h1>
        <Button variant="raised" on:click={() => (openAddProjectDialog = true)}>
            <ButtonLabel>Add new project</ButtonLabel>
            <i class="material-icons" aria-hidden="true">add</i>
        </Button>
    </div>

    <div class="card-display">
        <LayoutGrid>
            {#each projects as project}
                <Cell>
                    <Project on:openDeleteProjectDialog={openDeleteProjectDialog} project={project}/>
                </Cell>
            {/each}
            <!-- <Cell>
                <Upload bucketName="{BaseBucketName}" on:add={addProject}/>
            </Cell> -->
        </LayoutGrid>
    </div>
    <AddManageProjectDialog bind:open={openAddProjectDialog} on:add={addProject} newProject={true}></AddManageProjectDialog>
    <DeleteProjectDialog
        bind:open={deleteProjectDialogOpen}
        bind:projectId={deletedProjectId}
        on:delete={deleteProject}>
    </DeleteProjectDialog>
</div>

<style>
    .page-header {
        display: flex;
        align-items: center;
        padding: 0 24px;
        justify-content: space-between;
    }
</style>

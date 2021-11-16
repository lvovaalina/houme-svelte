<script>
    import LayoutGrid, { Cell } from "@smui/layout-grid"
    import CircularProgress from '@smui/circular-progress';


    import { onMount } from 'svelte';
    import { getNotificationsContext } from 'svelte-notifications';
    import DeleteProjectDialog from '../common/delete-project-dialog.svelte';
    import Project from "./project.svelte";

    export let deleteProjectDialogOpen = false;

    export let deletedProjectId = 0;

    const { addNotification } = getNotificationsContext();

    const api = isProduction
        ? "https://houme-api.herokuapp.com"
        : "http://localhost:10000";

    export let projects = [];

    let dataLoaded = false;

    onMount(function() {
        fetch(api + '/getProjects')
        .then((result) => {
            if (result.ok) {
                console.log("get projects successfully");
            }

            return result.json();
        })
        .then((resp) => {
            resp.data.forEach(element => {
                element.PropertyValue = null;
                element.ConstructionCost = 350000;
            });

            projects = resp.data;
            dataLoaded = true;
        });
    });

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
    {#if dataLoaded}
        <div class="page-header">
            <h1>Projects</h1>
        </div>

        <div class="card-display">
            <LayoutGrid style="padding-top:0;">
                {#each projects as project, index}
                    <Cell span={6}>
                        <Project ind={index} on:openDeleteProjectDialog={openDeleteProjectDialog} project={project}/>
                    </Cell>
                {/each}
            </LayoutGrid>
        </div>
    {:else}
        <div style="display: flex; justify-content: center">
            <CircularProgress style="height: 90vh; width: 120px;" indeterminate />
        </div>
    {/if}
    <DeleteProjectDialog
        bind:open={deleteProjectDialogOpen}
        bind:projectId={deletedProjectId}
        on:delete={deleteProject}>
    </DeleteProjectDialog>
</div>

<style>
    .hide {
        display: none;
    }

    .page-header {
        display: flex;
        align-items: center;
        padding: 0 24px;
        justify-content: space-between;
    }
</style>

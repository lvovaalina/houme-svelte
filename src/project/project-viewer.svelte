<script>
    import LayoutGrid, { Cell as GridCell} from '@smui/layout-grid'
    import ForgeViewer from './forge-viewer.svelte';
    import { time } from '../utils';
    import Button, { Label as ButtonLabel } from '@smui/button';
    import TabBar from '@smui/tab-bar';
    import Tab, { Label } from '@smui/tab';
    import ProjectTimeline from './project-timeline.svelte';
    import ProjectCost from './project-cost.svelte';
    import EditProjectPropertiesDialog from './edit-project-properties-dialog.svelte';
    import DeleteProjectDialog from '../common/delete-project-dialog.svelte';
    import ProjectMaterials from './project-materials.svelte';
    import { onMount } from 'svelte';
    import Drawer, {
        AppContent,
        Content as DrawerContent,
        Header,
        Title as DrawerTitle,
    } from '@smui/drawer';
    import List, { Item, Text } from '@smui/list';

    export let projectId;
    let active = 'Project View';

    let tabs = ['Project View', 'Timeline', 'Jobs']

    const api = isProduction
        ? "https://houme-api.herokuapp.com"
        : "http://localhost:10000";
    
    function setActive(value) {
        active = value;
    }

    let project = {};
    export let propertiesMap = new Map();
    
    let open = false;

    let openDeleteProjectDialog = false;
    let projectIdToDelete = 0;

    onMount(() => {
        fetch(api + '/getProject/' + projectId)
        .then((result) => {
            if (result.ok) {
                console.log("get projects successfully");
            }

            console.log(result);
            return result.json();
        })
        .then((resp) => {
            project = resp.data;
            console.log(project.ProjectProperties);

            propertiesMap = new Map(project.ProjectProperties.map(i => [i.PropertyCode, i]));
            projectIdToDelete = project.ProjectId;

            console.log(propertiesMap.get('FA'));
        });
    });

    function onDelete() {
        window.location.href = "/";
    }

</script>

<!-- svelte-ignore missing-declaration -->
<div class="project-viewer">
    <Drawer class="project-view-drawer">
        <Header>
          <DrawerTitle>Project {project.Name}</DrawerTitle>
          <!-- <Subtitle>Editing this properties will change cost and estimation of this project.</Subtitle> -->
        </Header>
        <DrawerContent>
            <div class="project-actions">
                <Button href="/" class="back-link project-actions-outline" variant="outlined" on:click={() => (open = true)}>
                    <i class="material-icons" aria-hidden="true">arrow_backward</i>
                    <ButtonLabel>Back</ButtonLabel>
                </Button>
                <Button variant="raised" on:click={() => (open = true)}>
                    <ButtonLabel>Manage Project</ButtonLabel>
                </Button>
                <Button class="project-actions-outline" variant="outlined" on:click={() => (openDeleteProjectDialog = true)}>
                    <ButtonLabel>Delete Project</ButtonLabel>
                </Button>
            </div>
            <List>
              {#each tabs as tab}
              <Item
                href="javascript:void(0)"
                on:click={() => setActive(tab)}
                activated={active === tab}
                >
                <Text>{tab}</Text>
                </Item>
              {/each}
          </List>
      </DrawerContent>
    </Drawer>

    <AppContent class="app-content">
        <div><DrawerTitle>{active}</DrawerTitle></div>
        {#if active == 'Project View'}
        <LayoutGrid>
            <GridCell span={9}>
                <ForgeViewer></ForgeViewer>
            </GridCell>
            <GridCell span={3}>
                <h2>Project Information</h2>
                <p>Living area: {project.LivingArea}</p>
                <p>Rooms number: {project.RoomsNumber}</p>
                <p>Construction cost: {project.ConstructionCost}</p>
                <p>Construction duration: {project.ConstructionDuration} days</p>
            </GridCell>
        </LayoutGrid>
        {/if}

        {#if active == 'Timeline'}
            <!-- <ProjectTimeline stages={stages}></ProjectTimeline> -->
        {/if}

        {#if active == 'Jobs'}
            <ProjectCost
                jobs={project.ProjectJobs}
                propertiesMap={propertiesMap}
                estimation={project.ConstructionDuration}></ProjectCost>
        {/if}

        {#if active == 'Materials'}
            <ProjectMaterials projectProperties={projectProperties} stages={stages} ></ProjectMaterials>
        {/if}
    </AppContent>

    
    <DeleteProjectDialog projectId={projectIdToDelete} bind:open={openDeleteProjectDialog} on:delete={onDelete}></DeleteProjectDialog>
    <!-- <EditProjectPropertiesDialog bind:open={open} stages={stages} /> -->
</div>

<style>
    :global(.project-actions) {
        margin: 16px;
    }

    :global(.project-actions button) {
        width: 100%;
    }

    :global(.project-actions .project-actions-outline) {
        border-color: #6200ee !important;
    }

    :global(.project-actions i) {
        width: 30px;
    }

    :global(.project-actions .back-link) {
        width: 100%;
        margin-bottom: 7px;
    }

    :global(.project-view-drawer) {
        background-color: #F6F3F9;
        border: none !important;
    }

    :global(.app-content) {
        background-color: white;
        padding: 25px;
        width: 80%;
    }

    .project-viewer {
        display: flex;
        flex-grow: 1;
        background-color: #F6F3F9;
    }

    .manage-project-button-container {
        text-align: center;
    }

    h2 {
        margin-top: 0;
    }
</style>
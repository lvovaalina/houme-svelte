<script>
    import LayoutGrid, { Cell as GridCell} from '@smui/layout-grid'
    import ForgeViewer from './forge-viewer.svelte';
    import Button, { Label as ButtonLabel } from '@smui/button';
    import ProjectTimeline from './project-timeline.svelte';
    import ProjectCost from './project-cost.svelte';
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
    import AddManageProjectDialog from '../common/add-manage-project-dialog.svelte';
    import { stageColorMap } from '../utils';

    export let projectId;
    let active = 'Timeline';

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

    export let dataLoaded;
    export let projectJobsVM = [];

    function createProjectJobsVM() {
        let reducedJobsByStageName = project.ProjectJobs.reduce(function (r, a) {
            r[a.Job.StageName] = r[a.Job.StageName] || [];
            r[a.Job.StageName].push(a);
            return r;
        }, Object.create(null));

        let jobsVM = [];

        Object.entries(reducedJobsByStageName).forEach(([stage, jobs]) => {
            let props = stageColorMap.get(stage);
            let stageVM =  {
                name: stage,
                color: props.color,
                code: props.code,
            }

            if (jobs.length == 1) {
                stageVM.duration = jobs[0].ConstructionDurationInDays;
                stageVM.stageCost = jobs[0].ConstructionCost;
                stageVM.workersCount = jobs[0].ConstructionWorkers;

                let projectProperty = propertiesMap.get(jobs[0].PropertyCode);
                if (projectProperty && projectProperty.Property) {
                    stageVM.propertyName = projectProperty.Property.PropertyName;
                    stageVM.propertyUnit = projectProperty.Property.PropertyUnit;
                    stageVM.propertyValue = projectProperty.PropertyValue;
                } else {
                    stageVM.propertyName = '-';
                    stageVM.propertyUnit = '-';
                    stageVM.propertyValue = '-';
                }
            } else {
                let stageDuration = 0, stageCost = 0, stageWorkers = 0;
                let tasks = [];
                jobs.forEach(job => {
                    stageDuration += job.ConstructionDurationInDays;
                    stageCost += job.ConstructionCost;
                    stageWorkers += job.ConstructionWorkers;

                    let newTask = {
                        name: job.Job.JobName,
                        duration: job.ConstructionDurationInDays,
                        cost: job.ConstructionCost,
                        workersCount: job.ConstructionWorkers
                    }

                    let projectProperty = propertiesMap.get(job.PropertyCode);
                    if (projectProperty && projectProperty.Property) {
                        newTask.propertyName = projectProperty.Property.PropertyName;
                        newTask.propertyUnit = projectProperty.Property.PropertyUnit;
                        newTask.propertyValue = projectProperty.PropertyValue;
                    } else {
                        newTask.propertyName = '-';
                        newTask.propertyUnit = '-';
                        newTask.propertyValue = '-';
                    }

                    tasks.push(newTask);
                });

                stageVM.stageDuration = stageDuration;
                stageVM.stageCost = stageCost;
                stageVM.workersCount = stageWorkers;
                stageVM.propertyName = '-';
                stageVM.propertyUnit = '-';
                stageVM.propertyValue = '-';
                stageVM.tasks = tasks;
            }

            jobsVM.push(stageVM);
        });
        projectJobsVM = jobsVM;
    }

    onMount(() => {
        fetch(api + '/getProject/' + projectId)
        .then((result) => {
            if (result.ok) {
                console.log("get project success");
            }

            return result.json();
        })
        .then((resp) => {
            project = resp.data;

            project.ProjectJobs.sort((el1, el2) => el1.Job.JobId - el2.Job.JobId);

            propertiesMap = new Map(project.ProjectProperties.map(i => [i.PropertyCode, i]));
            projectIdToDelete = project.ProjectId;

            createProjectJobsVM();

            dataLoaded = true;
        });
    });

    function onDelete() {
        window.location.href = "/";
    }

    function onUpdate() {
        dataLoaded = false;

        // fetch new project jobs as they not preloaded on save
        fetch(api + '/getProjectJobs/' + projectId)
        .then((result) => {
            if (result.ok) {
                console.log("get project jobs successfully");
            }

            return result.json();
        })
        .then((resp) => {
            let projectJobs = resp.data;
            projectJobs.sort((el1, el2) => el1.Job.JobId - el2.Job.JobId);
            project.ProjectJobs = projectJobs;
            createProjectJobsVM();
            dataLoaded = true;
        });
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
            <ProjectTimeline jobs={projectJobsVM}></ProjectTimeline>
        {/if}

        {#if active == 'Jobs'}
            <ProjectCost
                jobs={projectJobsVM}
                estimation={project.ConstructionDuration}
                bind:loaded={dataLoaded}></ProjectCost>
        {/if}
    </AppContent>
    
    <DeleteProjectDialog projectId={projectIdToDelete} bind:open={openDeleteProjectDialog} on:delete={onDelete}></DeleteProjectDialog>
    <AddManageProjectDialog bind:open={open} bind:project={project} on:update={onUpdate} newProject={false}/>
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
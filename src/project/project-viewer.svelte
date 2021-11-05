<script>
    import LayoutGrid, { Cell as GridCell} from '@smui/layout-grid'
    import ForgeViewer from './forge-viewer.svelte';
    import Button, { Label as ButtonLabel } from '@smui/button';
    import ProjectTimeline from './project-timeline.svelte';
    import ProjectCost from './project-cost.svelte';
    import DeleteProjectDialog from '../common/delete-project-dialog.svelte';
    import ProjectMaterials from './project-materials.svelte';
    import IconButton from "@smui/icon-button";
    import Tooltip, { Wrapper } from '@smui/tooltip';
    import { onMount } from 'svelte';
    import Drawer, {
        AppContent,
        Content as DrawerContent,
        Header,
        Title as DrawerTitle,
    } from '@smui/drawer';
    import List, { Item, Text } from '@smui/list';
    import AddManageProjectDialog from '../common/add-manage-project-dialog.svelte';
    import { stageColorMap, stageMap, time } from '../utils';

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

    export let dataLoaded;
    export let projectJobsCostVM = [];
    export let projectJobsTimelineVM = [];

    function reduceByPropertyValue(array, propName) {
        return array.reduce(function (r, a) {
            r[a.Job[propName]] = r[a.Job[propName]] || [];
            r[a.Job[propName]].push(a);
            return r;
        }, Object.create(null));
    }

    function arrayMax(arr) {
        return arr.reduce(function (p, v) {
            return ( p > v ? p : v );
        });
    }

    function getProjectJobsFromToTimestamps() {
        let currentStart = time('01-01');

        let timestamps = new Map();
        let currentParallelGroupCode = ''; 
        let currentDurationMax = Number.NEGATIVE_INFINITY;

        project.ProjectJobs.forEach(job => {
            let timestamp = {};
            if (!job.Job.InParallel) {
                if (currentParallelGroupCode !== '' && currentDurationMax != Number.NEGATIVE_INFINITY) {
                    currentStart = currentStart.clone().add(currentDurationMax, 'days');
                    currentDurationMax = Number.NEGATIVE_INFINITY;
                    currentParallelGroupCode = '';
                }

                timestamp.from = currentStart.clone();
                timestamp.to = currentStart.clone().add(job.ConstructionDurationInDays, 'days');
                currentStart = timestamp.to.clone();
            } else {
                if (currentParallelGroupCode !== '' && currentParallelGroupCode != job.Job.ParallelGroupCode) {
                    currentStart = currentStart.clone().add(currentDurationMax, 'days');
                    currentDurationMax = Number.NEGATIVE_INFINITY;
                }

                currentParallelGroupCode = job.Job.ParallelGroupCode;
                currentDurationMax = job.ConstructionDurationInDays > currentDurationMax
                    ? job.ConstructionDurationInDays
                    : currentDurationMax;

                timestamp.from = currentStart.clone();
                timestamp.to = currentStart.clone().add(job.ConstructionDurationInDays, 'days');
            }

            timestamps.set(job.Job.JobCode, timestamp);
        });

        return timestamps;
    }

    function createProjectJobsVM() {
        let reducedJobsByStageName = reduceByPropertyValue(project.ProjectJobs, "StageName");

        let reducedJobsBySubStageName = reduceByPropertyValue(project.ProjectJobs, "SubStageName");

        let jobsVM = [];
        let jobsTinelineVM = [];

        Object.entries(reducedJobsBySubStageName).forEach(([stage, jobs]) => {
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
                    stageCost += job.ConstructionCost;
                    stageWorkers += job.ConstructionWorkers;
                    stageDuration += job.ConstructionDurationInDays;

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

                stageVM.duration = stageDuration;
                stageVM.stageCost = stageCost;
                stageVM.workersCount = stageWorkers;
                stageVM.propertyName = '-';
                stageVM.propertyUnit = '-';
                stageVM.propertyValue = '-';
                stageVM.tasks = tasks;
            }

            jobsVM.push(stageVM);
        });


        let timestamps = getProjectJobsFromToTimestamps();

        Object.entries(reducedJobsByStageName).forEach(([stage, jobs]) => {
            let props = stageMap.get(stage);
            let stageVM =  {
                name: stage,
                color: props.color,
                code: props.code,
            }

            if (jobs.length == 1) {
                let timestamp = timestamps.get(jobs[0].Job.JobCode);
                stageVM.duration = jobs[0].ConstructionDurationInDays;
                stageVM.stageCost = jobs[0].ConstructionCost;
                stageVM.workersCount = jobs[0].ConstructionWorkers;
                stageVM.from = timestamp.from;
                stageVM.to = timestamp.to;

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

                let jobTaskMap = reduceByPropertyValue(jobs, "SubStageName");

                Object.entries(jobTaskMap).forEach(([subStageName, subtasks]) => {
                    let newTask = {
                        name: subStageName,
                    }
                    let taskChildren = [];
                    let dur = 0, cost = 0, workCount = 0;

                    
                    subtasks.forEach(st => {

                        let timestamp = timestamps.get(st.Job.JobCode);
                        
                        let subtask = {
                            name: st.Job.JobName,
                            duration: st.ConstructionDurationInDays,
                            cost: st.ConstructionCost,
                            workersCount: st.ConstructionWorkers,
                            from: timestamp.from,
                            to: timestamp.to,
                        }

                        let projectProperty = propertiesMap.get(st.PropertyCode);
                        if (projectProperty && projectProperty.Property) {
                            subtask.propertyName = projectProperty.Property.PropertyName;
                            subtask.propertyUnit = projectProperty.Property.PropertyUnit;
                            subtask.propertyValue = projectProperty.PropertyValue;
                        } else {
                            subtask.propertyName = '-';
                            subtask.propertyUnit = '-';
                            subtask.propertyValue = '-';
                        }

                        stageDuration += subtask.duration;
                        stageCost += subtask.cost;
                        stageWorkers += subtask.workersCount;

                        if (subStageName === stage || subtasks.length === 1) {
                            tasks.push(subtask);
                        } else {
                            dur += subtask.duration;
                            cost += subtask.cost;
                            workCount = subtask.workersCount;
                            taskChildren.push(subtask);
                        }
                    });

                    if (subStageName !== stage && subtasks.length !== 1) {
                        newTask.duration = dur;
                        newTask.cost = cost;
                        newTask.workersCount = workCount;
                        newTask.children = taskChildren;
                        tasks.push(newTask);
                    }
                });

                stageVM.duration = stageDuration;
                stageVM.stageCost = stageCost;
                stageVM.workersCount = stageWorkers;
                stageVM.propertyName = '-';
                stageVM.propertyUnit = '-';
                stageVM.propertyValue = '-';
                stageVM.tasks = tasks;
            }

            jobsTinelineVM.push(stageVM);
        });

        console.log("Jobs,", jobsTinelineVM);

        projectJobsTimelineVM = jobsTinelineVM;
        projectJobsCostVM = jobsVM;
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
        <Header style="padding:0;">
          <!-- <DrawerTitle>
                
            </DrawerTitle> -->
            <div style="display:flex;justify-content: space-between; align-items: baseline;">
                <div style="display:flex;align-items: baseline;">
                    <Wrapper>
                        <IconButton href="/">
                            <i style="margin-right:10px;color:#6200ee;"  class="fa fa-arrow-left" aria-hidden="true"></i>
                            <!-- <i style="margin-right:10px;color:#6200ee;" class="material-icons" aria-hidden="true">arrow_backward</i> -->
                        </IconButton>
                        <Tooltip style="z-index:7">Back to Project Dashboard</Tooltip>
                    </Wrapper>
                    <h1>Project {project.Name}</h1>
                </div>
                <div style="display:flex;">
                    <Wrapper>
                        <IconButton style="font-size: 18px; margin-right:-15px;" on:click={() => (open = true)}>
                            <i style="color:#6200ee;" class="fa fa-cog" aria-hidden="true"></i>
                        </IconButton>
                        <Tooltip style="z-index:7">Manage Project</Tooltip>
                    </Wrapper>

                    <Wrapper>
                        <IconButton style="font-size: 18px;" on:click={() => (openDeleteProjectDialog = true)}>
                            <i style="color:#6200ee;" class="material-icons" aria-hidden="true">delete</i>
                        </IconButton>
                        <Tooltip style="z-index:7">Delete Project</Tooltip>
                    </Wrapper>
                </div>
            </div>
          <!-- <Subtitle>Editing this properties will change cost and estimation of this project.</Subtitle> -->
        </Header>
        <DrawerContent>
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

        <div class="{active == 'Project View' ? '' : 'hidden'}">
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
        </div>

        <div class="{active == 'Timeline' ? '' : 'hidden'}">
            <ProjectTimeline jobs={projectJobsTimelineVM}></ProjectTimeline>
        </div>

        <div class="{active == 'Jobs' ? '' : 'hidden'}">
        <ProjectCost
                jobs={projectJobsCostVM}
                estimation={project.ConstructionDuration}
                bind:loaded={dataLoaded}>
        </ProjectCost>
        </div>
    </AppContent>
    
    <DeleteProjectDialog projectId={projectIdToDelete} bind:open={openDeleteProjectDialog} on:delete={onDelete}></DeleteProjectDialog>
    <AddManageProjectDialog bind:open={open} bind:project={project} on:update={onUpdate} newProject={false}/>
</div>

<style>
    .hidden {
        display: none;
    }

    :global(.project-view-drawer) {
        background-color: #F6F3F9;
        border: none !important;
        width: 20%;
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
<script>
    import LayoutGrid, { Cell} from '@smui/layout-grid';
    import CircularProgress from '@smui/circular-progress';
    import ForgeViewer from './forge-viewer.svelte';
    import ProjectTimeline from './project-timeline.svelte';
    import ProjectCost from './project-cost.svelte';
    import Ripple from '@smui/ripple';
    import { navigate, Link } from "svelte-navigator";
    import { onMount } from 'svelte';
    import { stageColorMap, stageMap, time } from '../utils';
    import ProjectCard from '../project/project-card.svelte';
    import ProjectMaterials from '../project/project-materials.svelte';
    import { pageTitle, projectStored, propertiesStored } from '../store';
    import { watchResize } from "svelte-watch-resize";

    import { getNotificationsContext } from 'svelte-notifications';
    const { addNotification } = getNotificationsContext();

    export let projectId;
    export let active = 'Model';

    let tabs = [
        {name: 'Model', urlPart: 'model'},
        {name: 'Timeline', urlPart: 'timeline'},
        {name: 'Jobs', urlPart: 'jobs'},
        {name: 'Materials', urlPart: 'materials'},
    ];

    let tabsResponsive = [
        {name: 'Details', urlPart: 'details'},
        {name: 'Model', urlPart: 'model'},
        {name: 'Timeline', urlPart: 'timeline'},
        {name: 'Jobs', urlPart: 'jobs'},
        {name: 'Materials', urlPart: 'materials'},
    ];

    let headerTabs = [];

    function getWidth() {
        return Math.max(
            document.body.scrollWidth,
            document.documentElement.scrollWidth,
            document.body.offsetWidth,
            document.documentElement.offsetWidth,
            document.documentElement.clientWidth
        );
    }
    export let currency = '$';
    
    import { config } from '../config';
    let conf = new config();

    let project = {};
    export let propertiesMap = new Map();
    let properties = [];

    export let dataLoaded;

    function reduceByJobPropertyValue(array, propName) {
        return array.reduce(function (r, a) {
            r[a.Job[propName]] = r[a.Job[propName]] || [];
            r[a.Job[propName]].push(a);
            return r;
        }, Object.create(null));
    }

    function reduceByConstructionMaterialPropertyValue(array, propName) {
        return array.reduce(function (r, a) {
            r[a.ConstructionJobMaterial.Job[propName]] = r[a.ConstructionJobMaterial.Job[propName]] || [];
            r[a.ConstructionJobMaterial.Job[propName]].push(a);
            return r;
        }, Object.create(null));
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
        let reducedJobsByStageName = reduceByJobPropertyValue(project.ProjectJobs, "StageName");

        let reducedJobsBySubStageName = reduceByJobPropertyValue(project.ProjectJobs, "SubStageName");

        let reducedMaterialsByJobName = reduceByConstructionMaterialPropertyValue(project.ProjectMaterials, "JobName");

        let jobsVM = [];
        let jobsTinelineVM = [];

        Object.entries(reducedJobsBySubStageName).forEach(([stage, jobs]) => {
            let props = stageColorMap.get(stage);
            let stageVM =  {
                name: stage,
                color: props.color,
                code: props.code,
            }

            let stageDuration = 0, stageCost = 0, stageWorkers = 0;
            let tasks = [];
            let isPropertySetForStage = false;

            jobs.forEach(job => {

                stageCost += job.ConstructionCost;
                stageWorkers += job.ConstructionWorkers;
                stageDuration += job.ConstructionDurationInDays;

                let projectProperty = propertiesMap.get(job.Job.Property.PropertyCode);
                if (job.Job.JobName != stage && jobs.length != 1) {
                    let newTask = {
                        name: job.Job.JobName,
                        duration: job.ConstructionDurationInDays,
                        cost: job.ConstructionCost,
                        workersCount: job.ConstructionWorkers
                    }

                    if (job.Job.Property && !!job.Job.Property.PropertyCode) {
                        newTask.propertyName = job.Job.Property.PropertyName;
                        newTask.propertyUnit = job.Job.Property.PropertyUnit;
                        newTask.propertyValue = projectProperty.PropertyValue;
                    } else {
                        newTask.propertyName = '-';
                        newTask.propertyUnit = '-';
                        newTask.propertyValue = '-';
                    }

                    tasks.push(newTask);
                } 
                
                if (jobs.length == 1) {
                    if (job.Job.Property && !!job.Job.Property.PropertyCode) {
                        stageVM.propertyName = job.Job.Property.PropertyName;
                        stageVM.propertyUnit = job.Job.Property.PropertyUnit;
                        stageVM.propertyValue = projectProperty.PropertyValue;
                        isPropertySetForStage = true;
                    }

                    if (job.Job.JobName != stage) {
                        stageVM.name = stageVM.name + ' (' + job.Job.JobName + ')';
                    }
                }
            });

            stageVM.duration = stageDuration;
            stageVM.stageCost = stageCost;
            stageVM.workersCount = stageWorkers;

            if (!isPropertySetForStage) {
                stageVM.propertyName = '-';
                stageVM.propertyUnit = '-';
                stageVM.propertyValue = '-';
            }
            
            stageVM.tasks = tasks;

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
                if (projectProperty && projectProperty.Job && projectProperty.Job.Property) {
                    stageVM.propertyName = projectProperty.Job.Property.PropertyName;
                    stageVM.propertyUnit = projectProperty.Job.Property.PropertyUnit;
                    stageVM.propertyValue = projectProperty.PropertyValue;
                } else {
                    stageVM.propertyName = '-';
                    stageVM.propertyUnit = '-';
                    stageVM.propertyValue = '-';
                }
            } else {
                let stageDuration = 0, stageCost = 0, stageWorkers = 0;
                let tasks = [];

                let jobTaskMap = reduceByJobPropertyValue(jobs, "SubStageName");

                Object.entries(jobTaskMap).forEach(([subStageName, subtasks]) => {
                    let newTask = {
                        name: subStageName,
                    }
                    let taskChildren = [];
                    let dur = 0, cost = 0, workCount = 0;

                    let addTask = false;

                    subtasks.forEach(st => {

                        let timestamp = timestamps.get(st.Job.JobCode);

                        let materials = reducedMaterialsByJobName[st.Job.JobName];
                        let subtaskMaterials = [];
                        let materialCost = 0;
                        if (!!materials && materials.length > 0) {
                            materials.forEach(m => {
                                materialCost += parseInt(m.MaterialCost);
                                subtaskMaterials.push({
                                    name: m.ConstructionJobMaterial.MaterialName,
                                });
                            });
                        }

                        let subtask = {
                            name: st.Job.JobName,
                            duration: st.ConstructionDurationInDays,
                            cost: st.ConstructionCost,
                            workersCount: st.ConstructionWorkers,
                            from: timestamp.from,
                            to: timestamp.to,
                            materials: subtaskMaterials,
                            materialsCost: materialCost,
                        }

                        let projectProperty = propertiesMap.get(st.PropertyCode);
                        if (projectProperty && projectProperty.Job.Property) {
                            subtask.propertyName = projectProperty.Job.Property.PropertyName;
                            subtask.propertyUnit = projectProperty.Job.Property.PropertyUnit;
                            subtask.propertyValue = projectProperty.PropertyValue;
                        } else {
                            subtask.propertyName = '-';
                            subtask.propertyUnit = '-';
                            subtask.propertyValue = '-';
                        }

                        stageDuration += subtask.duration;
                        stageCost += subtask.cost;
                        stageWorkers += subtask.workersCount;

                        if (subStageName !== st.Job.JobName) {
                            if (subStageName === stage) {
                                tasks.push(subtask);
                            } else {
                                addTask = true;
                                dur += subtask.duration;
                                cost += subtask.cost;
                                workCount = subtask.workersCount;
                            }
                        } else if (subStageName === stage || subtasks.length === 1) {
                            tasks.push(subtask);
                        } if (subtasks.length === 1 && subStageName !== stage) {
                            dur += subtask.duration;
                            cost += subtask.cost;
                            workCount = subtask.workersCount;
                            taskChildren.push(subtask);
                        } else {
                            dur += subtask.duration;
                            cost += subtask.cost;
                            workCount = subtask.workersCount;
                            taskChildren.push(subtask);
                        }
                    });

                    if ((subStageName !== stage && subtasks.length !== 1) || addTask) {
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

        let materialsVM = []
        project.ProjectMaterials.forEach(element => {
            let property = propertiesMap.get(element.ConstructionJobMaterial.Job.PropertyID);
            let props = stageMap.get(element.ConstructionJobMaterial.Job.StageName);

            let timestamp = timestamps.get(element.ConstructionJobMaterial.Job.JobCode);

            materialsVM.push({
                name: element.ConstructionJobMaterial.MaterialName,
                cost: element.MaterialCost,
                nominalCost: element.ConstructionJobMaterial.MaterialCost,
                volume: property.PropertyValue,
                propertyUnit: element.ConstructionJobMaterial.Job.Property.PropertyUnit,
                jobName: element.ConstructionJobMaterial.Job.SubStageName
                    + ': ' + element.ConstructionJobMaterial.Job.JobName,
                color: props.color,
                date: timestamp.from,
            })
        });

        project.projectJobsTimelineVM = jobsTinelineVM;
        project.projectJobsCostVM = jobsVM;
        project.projectMaterialsVM = materialsVM;
    }

    let getProject = function(projectId) {
        let getProperties = fetch(conf.api  + '/getProperties')
        .then((result) => {
            if (result.ok) {
                console.log("get successfully");
            }

            return result.json();
        })
        .then((resp) => {
            resp.data.forEach(element => {
                element.PropertyValue = null;
            });

            properties = resp.data;
            propertiesStored.set(properties);
        });

        let getProject = () =>{
            fetch(conf.api  + '/getProject/' + projectId)
            .then((result) => {
                if (result.ok) {
                    console.log("get project success");
                }

                return result.json();
            })
            .then((resp) => {
                resp.data.projectMaterialsVM = [];
                resp.data.projectJobsCostVM = [];
                resp.data.projectJobsTimelineVM = [];
                project = resp.data;

                project.ProjectJobs.sort((el1, el2) => el1.Job.JobId - el2.Job.JobId);

                properties.forEach((prop) => {
                    let props = project.ProjectProperties.filter(p => p.Property.PropertyCode == prop.PropertyCode);
                    if (props.length !== 0) {
                        prop.PropertyValue = props[0].PropertyValue;
                    }
                });

                project.ProjectProperties = properties;
                propertiesMap = new Map(project.ProjectProperties.map(i => [i.PropertyCode, i]));

                createProjectJobsVM();

                projectStored.set(project);
                pageTitle.set({
                    title: 'Project View ' + newValActive,
                    projectName: project.Name,
                })

                dataLoaded = true;
            });
        }

        getProperties.then(() => getProject());
    }

    $:newValActive = active
    $:pageTitle.set({
            title: 'Project View ' + newValActive
        });

    onMount(() => {
        pageTitle.set({
            title: 'Project View ' + active,
        });
        if ($projectStored.ProjectId != projectId) {
            getProject(projectId);
        } else {
            project = $projectStored;
            properties = $propertiesStored;
            pageTitle.set({
                    title: 'Project View ' + newValActive,
                    projectName: project.Name,
                })
            dataLoaded = true;
        }

        setHeaderTabs();
    });

    function setHeaderTabs() {
        if (getWidth() > 839) {
            headerTabs = tabs;
        } else {
            headerTabs = tabsResponsive;
        }
    }

    function handleResize() {
        setHeaderTabs();

        if (active == 'Details' && getWidth() > 839) {
            navigate('/view/' + project.ProjectId, {replace: true});
        }
    }

    async function updateProject(event) {
        dataLoaded = false;
        event.preventDefault();
        event.stopPropagation();

        let projectToUpdate = project;
        projectToUpdate.ProjectJobs = [];

        await fetch(conf.api + '/updateProjectProperties/'+ project.ProjectId,
        {
            method: 'PUT',
            body: JSON.stringify(project)
        })
        .then((result) => {
            if (result.ok) {
                console.log("Updated successfully");
            }

            return result.json();
        })
        .then((data) => {
            let updatedProject = data.data;
            let projectJobs = updatedProject.ProjectJobs;
            updatedProject.projectJobsTimelineVM = [];
            updatedProject.projectJobsCostVM = [];
            updatedProject.projectMaterialsVM = [];
            projectJobs.sort((el1, el2) => el1.Job.JobId - el2.Job.JobId);
            updatedProject.ProjectJobs = projectJobs;

            propertiesMap = new Map(updatedProject.ProjectProperties.map(i => [i.PropertyCode, i]));
            
            project = updatedProject;
            createProjectJobsVM();
            projectStored.set(project);

            dataLoaded = true;
        })
        .catch(error => {
            let errorMessage = 'Something went wrong! Try again later';
            addNotification({
                text: errorMessage,
                position: 'top-center',
                type: 'danger'
            });
            console.error(error);
        });
    }

    function getBorderRadius(index, arr) {
        if (index == 0) {
            return "br-half-right";
        }

        if (index == arr.length - 1) {
            return "br-half-left";
        }

        return "no-br";
    }
</script>

<div class="project-viewer" use:watchResize={handleResize}>
    <div class="project-view-content">

        <LayoutGrid class="project-content-grid">
            <Cell span={9} class="project-view-content-details">

                {#if dataLoaded}
                <div class="project-name-container-responsive">
                    <Link
                        class="dashboard-link"
                        to="/">
                        <i class="arrow left"></i>
                    </Link>
                    <h2 class="project-name-responsive">{project.Name}</h2>
                </div>
                {/if}

                <div class="project-view-header">
                    <div class="project-view-buttons-container">
                        {#each headerTabs as tab, index}
                        <div use:Ripple={{ surface: true }}
                        class={
                            active === tab.name ? getBorderRadius(index, tabs) + " tab-link-container active"
                                : getBorderRadius(index, tabs) + " tab-link-container"}>
                            <Link
                                class="tab-link"
                                style={active === tab.name ? "color:#182956" : "color: #5D6989"}
                                to="/view/{project.ProjectId}/{tab.urlPart}">
                                {tab.name}
                            </Link>
                        </div>
                        {/each}
                    </div>
                </div>

                <div class="{active == 'Timeline' ? '' : 'hidden'}">
                    <div class="details-padding"></div>
                    <ProjectTimeline projectDuration={project.ConstructionDuration} currency={currency} jobs={project.projectJobsTimelineVM}></ProjectTimeline>
                </div>

                <div class="{active == 'Materials' ? '' : 'hidden'}">
                    <div class="details-padding"></div>
                    <ProjectMaterials currency={currency} materials={project.projectMaterialsVM}></ProjectMaterials>
                </div>
                
                <div class="{active == 'Jobs' ? '' : 'hidden'}">
                    <div class="details-padding"></div>
                    <ProjectCost
                            currency={currency}
                            jobs={project.projectJobsCostVM}
                            estimation={project.ConstructionDuration}
                            bind:loaded={dataLoaded}>
                    </ProjectCost>
                </div>

                <div class="{active == 'Model' ? '' : 'hidden-forge'}">
                    <div class="details-padding"></div>
                    <ForgeViewer urn={project.Filename}></ForgeViewer>
                </div>

                <div class="{active == 'Details' ? 'project-card-tab-responsive' : 'hidden'}">
                    {#if dataLoaded}
                    <ProjectCard bind:project={project} currency={currency} on:apply={updateProject}></ProjectCard>
                    {/if}
                </div>
            </Cell>
            <Cell span={3} class="project-card-cell">
                <div class="project-card">
                    {#if dataLoaded}
                        <ProjectCard bind:project={project} currency={currency} on:apply={updateProject}></ProjectCard>
                    {:else}
                        <CircularProgress style="height: 90vh; width: 120px;" indeterminate />
                    {/if}
                </div>
            </Cell>
        </LayoutGrid>
    </div>
</div>

<style>
    .project-card-tab-responsive, .project-name-container-responsive {
        display: none;
    }

    :global(.tab-link) {
        font-weight: 500;
        font-size: 14px;
        display:flex;
        align-items:center;
        justify-content:center;
        height:100%;
        width:100%;
    }

    .tab-link-container {
        color: rgb(21, 40, 89);
        height: 36px;
        display: flex;
        align-items: center;
        border: 1px solid #e0e1e2;
        border-radius: 4px;
        width: 25%;
        justify-content: center;
        text-transform: uppercase;
    }

    /* do not hide forge component to allow reload forge model on tab change */
    .br-half-right {
        border-radius: 4px 0 0 4px;
    }

    .br-half-left {
        border-radius: 0 4px 4px 0;
    }

    .no-br {
        border-radius: 0;
    }

    .hidden-forge {
        position: absolute;
        top: -500px;
        left: -500px;
    }

    .divider {
        border-bottom: 1px solid #e0e1e2;;
    }

    .card-header {
        margin-bottom: 10px;
    }

    .numeric-row {
        text-align: right;
        font-weight: 500;
    }

    .property-table {
        margin-bottom: 10px;
    }

    .hidden {
        display: none;
    }

    .project-view-header {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 20px 0;
    }

    .project-view-buttons-container {
        display: flex;
        width: 80%;
    }

    .project-viewer {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        padding: 0 25px;
    }

    .project-card {
        padding: 20px 0 0 24px;

        display: flex;
        flex-direction: column;

        height: 100%;
    }

    :global(.tab-button .mdc-button__ripple::before, .tab-button .mdc-button__ripple::after) {
        background-color: rgba(21, 40, 89);
    }

    .tab-link-container.active {
        border-color: rgba(21, 40, 89);
    }

    :global(.project-view-content-details) {
        /* -header height -tab header height container bottom padding */
        height: calc(100vh - 64px);
        border-right: 1px solid #d3d3d1;
    }

    :global(.project-content-grid) {
        padding: 0;
    }

    @media only screen and (max-width:839px)
    {
        .details-padding {
            background-color: #F5F7FA;
            margin: 0 -14px;
            opacity: 70%;
            height: 12px;
        }

        .tab-link:first-of-type {
            justify-content: start;
        }

        .project-view-buttons-container {
            width: 100%;
            display: flex;
            justify-content: space-between;
            padding: 0 14px;
        }

        .tab-link-container {
            border: none;
            border-radius: 0;
            color: #5D6989;
            width: auto;
        }

        :global(.tab-link-container.active a) {
            border-bottom: 4px solid #182956;
            width: auto;
        }

        .project-card-tab-responsive {
            display: block;
        }

        .project-name-container-responsive {
            display: flex;
            align-items: center;
            margin: 14px 0 6px;
        }

        .project-name-container-responsive h2 {
            margin: 0;
            font-size: 20px;
            font-weight: 500;
        }

        .project-name-container-responsive i {
            margin: 2px 10px 2px 4px;
        }

        .project-card {
            display: none;
            
        }

        :global(.project-card-cell) {
            display: none;
        }

        :global(.project-view-content-details) {
            /* -header height -tab header height container bottom padding */
            height: calc(100vh - 38px);
            border: none;
        }

        .project-viewer {
            padding: 0 12px;
        }

        .project-view-header {
            margin-bottom: 14px;
            padding: 0;
            margin: 10px -14px 0;
            /*box-shadow: 0 4px 2px -2px gray;*/
            box-shadow:  2px 2px rgba(0, 0, 0, 0.06), 0px 1px 1px rgba(0, 0, 0, 0.06);
        }
    }
</style>
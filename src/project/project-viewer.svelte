<script>
    import LayoutGrid, { Cell} from '@smui/layout-grid'
    import ForgeViewer from './forge-viewer.svelte';
    import ProjectTimeline from './project-timeline.svelte';
    import ProjectCost from './project-cost.svelte';
    import { navigate } from "svelte-navigator";
    import Button, {Label} from '@smui/button';
    import { onMount } from 'svelte';
    import { stageColorMap, stageMap, time } from '../utils';
    import ProjectSettings from '../project/project-settings.svelte';
    import { pageTitle, projectStored, propertiesStored } from '../store';
    import { Icon } from '@smui/common'

    export let projectId;
    export let active = 'Model';

    let tabs = [{name: 'Model', urlPart: 'model'},{name: 'Timeline', urlPart: 'timeline'}, {name: 'Jobs', urlPart:'jobs'}]
    
    import { config } from '../config';
    let conf = new config();
    function setActive(value) {
		navigate('/view/' + projectId + '/' + value.urlPart, { replace: true });
    }

    let project = {};
    export let propertiesMap = new Map();
    let properties = [];
    
    let open = false;

    export let dataLoaded;

    function reduceByPropertyValue(array, propName) {
        return array.reduce(function (r, a) {
            r[a.Job[propName]] = r[a.Job[propName]] || [];
            r[a.Job[propName]].push(a);
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

            let stageDuration = 0, stageCost = 0, stageWorkers = 0;
            let tasks = [];
            let isPropertySetForStage = false;

            jobs.forEach(job => {

                stageCost += job.ConstructionCost;
                stageWorkers += job.ConstructionWorkers;
                stageDuration += job.ConstructionDurationInDays;

                let projectProperty = propertiesMap.get(job.Job.Property.PropertyCode);
                if (job.Job.JobName != stage) {
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

        project.projectJobsTimelineVM = jobsTinelineVM;
        project.projectJobsCostVM = jobsVM;
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
        console.log(projectStored);
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
    });

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
            projectJobs.sort((el1, el2) => el1.Job.JobId - el2.Job.JobId);
            updatedProject.ProjectJobs = projectJobs;

            propertiesMap = new Map(updatedProject.ProjectProperties.map(i => [i.PropertyCode, i]));
            
            project = updatedProject;
            createProjectJobsVM();
            projectStored.set(project);

            dataLoaded = true;
        })
        .catch(error => {
            errorMessage = 'Something went wrong! Try again later';
            addNotification({
                text: errorMessage,
                position: 'top-center',
                type: 'danger'
            });
            console.error(error);
        });
    }
</script>

<div class="project-viewer">
    <div class="project-view-content">
        <LayoutGrid class="project-content-grid">
            <Cell span={9} class="project-view-content-details">
                <div class="project-view-header">
                    <div class="project-view-buttons-container">
                        {#each tabs as tab}
                        <Button
                            style="width: 200px;color: #152859;"
                            variant="outlined"
                            href="javascript:void(0)"
                            on:click={() => setActive(tab)}
                            class={active === tab.name ? 'activated tab-button' : 'tab-button'}
                            >
                            <Label>{tab.name}</Label>
                        </Button>
                        {/each}
                    </div>
                </div>
                <div class="{active == 'Timeline' ? '' : 'hidden'}">
                    <ProjectTimeline jobs={project.projectJobsTimelineVM}></ProjectTimeline>
                </div>
                
                <div class="{active == 'Jobs' ? '' : 'hidden'}">
                <ProjectCost
                        jobs={project.projectJobsCostVM}
                        estimation={project.ConstructionDuration}
                        bind:loaded={dataLoaded}>
                </ProjectCost>
                </div>

                <div class="{active == 'Model' ? '' : 'hidden-forge'}">
                    <ForgeViewer></ForgeViewer>
                </div>
            </Cell>
            <Cell span={3}>
                <div class="project-card">
                    {#if dataLoaded}
                    <h3 class="card-header" style="margin-top: 0;">Project Details</h3>
                    <table class="property-table" aria-label="Project properties" style="width: 100%;">
                        <tr>
                            <td>Area</td>
                            <td class="numeric-row">{project.LivingArea.replace(" sq.m.", "")}&#13217;</td>
                        </tr>
                        <tr>
                            <td>Construction Cost</td>
                            <td class="numeric-row">{project.ConstructionCost} &dollar;</td>
                        </tr>
                        <tr>
                            <td>Materials Cost</td>
                            <td class="numeric-row">{project.ConstructionCost} &dollar;</td>
                        </tr>
                        <tr>
                            <td>Project Duration</td>
                            <td class="numeric-row">{project.ConstructionDuration} days</td>
                        </tr>
                        <tr>
                            <td>People</td>
                            <td class="numeric-row">50</td>
                        </tr>
                        <tr>
                            <td>Margin</td>
                            <td class="numeric-row">{project.ConstructionCost * 0.15} $</td>
                        </tr>
                    </table>
                    <div class="divider"/>
                    <div class="materials-block">
                        <h3 class="card-header">Options</h3>
                        <ProjectSettings
                            bind:foundationMaterialValue={project.FoundationMaterial}
                            bind:wallMaterialValue={project.WallMaterial}
                            bind:finishMaterialValue={project.FinishMaterial}
                            bind:roofingMaterialValue={project.RoofingMaterial}
                            bind:constructionWorkersNumberValue={project.ConstructionWorkersNumber}>
                        </ProjectSettings>
                    </div>

                    <Button
                        style="margin-top: 10px;text-align: left;background-color: #152859; color: white; align-self: flex-end;"
                        variant="filled" on:click={updateProject}>
                        <Label >APPLY</Label>
                    </Button>
                    {/if}
                </div>
            </Cell>
        </LayoutGrid>
    </div>
</div>

<style>
    /* do not hide forge component to allow reload forge model on tab change */
    .hidden-forge {
        position: absolute;
        top: -500px;
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

    .property-table tr {
        height: 30px;
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
        width: 50%;
        display: flex;
    }

    .project-viewer {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        padding: 0 25px 20px;
    }

    .project-card {
        padding: 20px 24px 0;

        display: flex;
        flex-direction: column;

        height: 100%;
    }

    :global(.tab-button.back-button .mdc-button__ripple) {
        padding: 0 8px !important;
        left: -8px !important;
    }

    :global(.back-button .mdc-button__label) {
        display: flex;
        align-items: center;
    }

    :global(.tab-button .mdc-button__ripple::before, .tab-button .mdc-button__ripple::after) {
        background-color: rgba(21, 40, 89);
    }

    :global(.tab-button.activated) {
        border-color: rgba(21, 40, 89);
    }

    :global(.project-view-content-details) {
        /* -header height -tab header height container bottom padding */
        height: calc(100vh - 80px - 76px);
        border-right: 1px solid #d3d3d1;
    }

    :global(.project-content-grid) {
        padding: 0;
    }
</style>
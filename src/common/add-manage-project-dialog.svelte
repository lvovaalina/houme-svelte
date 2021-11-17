<script>
    import Dialog, { Title, Content, Actions } from '@smui/dialog';
    import Button, { Label as ButtonLabel } from '@smui/button';
    import CircularProgress from '@smui/circular-progress';
    import Textfield from '@smui/textfield';
    import LayoutGrid, { Cell } from "@smui/layout-grid"

    import ProjectSettings from '../project/project-settings.svelte';

    import { onMount } from 'svelte';

    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    import { getNotificationsContext } from 'svelte-notifications';
    const { addNotification } = getNotificationsContext();

    let dataLoaded = true;
    export let fullAccess = false;

    let jobs = [];
    export let properties = [];

    let errorMessage = '';

    export let open;
    export let newProject;
    export let project = {};

    project.Name = '';
    project.BucketName = 'houmly';
    project.LivingArea= '';
    project.RoomsNumber= null;
    project.ConstructonWorkersNumber= '';
    project.WallMaterial= '';
    project.FoundationMaterial= '';
    project.FinishMaterial= '';
    project.RoofingMaterial= '';
    project.ConstructionCost= null;
    project.ConstructionDuration= 0;
    project.ProjectProperties= [];
    project.ProjectJobs= [];
    project.ConstructionCompanyName= 'Construction';

    const api = isProduction
        ? "https://houme-api.herokuapp.com"
        : "http://localhost:10000";

    function setProjectJobs() {
        let wallJobs = jobs
            .filter(j => j.StageName.toLowerCase() == 'walls'
                && j.WallMaterial.toLowerCase() == project.WallMaterial.toLowerCase());
        
        let foundationJobs = jobs
            .filter(j => j.StageName.toLowerCase() == 'foundation'
                && j.FoundationMaterial.toLowerCase() == project.FoundationMaterial.toLowerCase());
        
        let finishJobs = jobs
            .filter(j => j.StageName.toLowerCase() == 'exterior decoration of the house'
                && j.FinishMaterial.toLowerCase() == project.FinishMaterial.toLowerCase());
        
        let roofingJobs = jobs
            .filter(j => j.StageName.toLowerCase() == 'roof'
                && j.RoofingMaterial.toLowerCase() == project.RoofingMaterial.toLowerCase())
        
        let projectJobs = jobs.filter(j => j.Required == true);
        projectJobs = projectJobs.concat(wallJobs);
        projectJobs = projectJobs.concat(foundationJobs);
        projectJobs = projectJobs.concat(roofingJobs);
        projectJobs = projectJobs.concat(finishJobs);

        let projectJobsModel = [];
        projectJobs.forEach(element => {
            projectJobsModel.push({
                ...element,
                Job: element,
            });
        });

        project.ProjectJobs = projectJobsModel;
    }

    async function addProject(event) {
        dataLoaded = false;
        event.preventDefault();
        event.stopPropagation();

        setProjectJobs();

        project.ProjectProperties = properties;
        project.Filename = project.Name + '.rvt';
        console.log(typeof project);
        console.log(project);

        await fetch(api + '/create',
        {
            method: 'POST',
            body: JSON.stringify(project)
        })
        .then((result) => {
            if (result.ok) {
                console.log("Add successfully");
               
            }

            return result.json();
        })
        .then((data) => {
            let project = data.data;
            dispatch("add", {
                project: {
                    ProjectId: project.ProjectId,
                    Name: project.Name,
                    LivingArea: project.LivingArea,
                    RoomsNumber: project.RoomsNumber,
                    ConstructionCost: project.ConstructionCost,
                    ConstructionDuration: project.ConstructionDuration
                }
            });
            dataLoaded = true;
            open = false;
        })
        .catch(error => {
            errorMessage = 'Something went wrong! Try again later';
            addNotification({
                text: errorMessage,
                position: 'top-center',
                type: 'danger'
            });
            console.error(error);
            dataLoaded = true;
        });
    }

    onMount(function() {
        let getProperties = fetch(api + '/getProperties')
        .then((result) => {
            if (result.ok) {
                console.log("get props successfully");
            }

            return result.json();
        })
        .then((resp) => {
            resp.data.forEach(element => {
                element.PropertyValue = null;
            });

            properties = resp.data;
        });

        let getJobs = fetch(api + '/getJobs')
        .then((result) => {
            if (result.ok) {
                console.log("get jobs successfully");
            }

            return result.json();
        })
        .then((resp) => {
            resp.data.forEach(element => {
                element.PropertyValue = null;
            });

            jobs = resp.data;
        });

        Promise.all([getProperties, getJobs])
            .then(() => {
                dataLoaded = true;
            })
    });

    async function updateProject(event) {
        dataLoaded = false;
        event.preventDefault();
        event.stopPropagation();
        setProjectJobs();
        //setProjectProperties();

        console.log('BEFORE REQUEST', project.ProjectProperties);

        await fetch(api + '/updateProject/'+ project.ProjectId,
        {
            method: 'PUT',
            body: JSON.stringify(project)
        })
        .then((result) => {
            if (result.ok) {
                console.log("Updated successfully");
                dispatch("update", { projectId: project.ProjectId});
            }

            return result.json();
        })
        .then((data) => {
            let updatedProject = data.data;
            console.log('AFTER UPDATE', updatedProject.ProjectProperties);

            //wait for all data to be loaded
            updatedProject.ProjectJobs = [];

            project = updatedProject;
            open = false;
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
            dataLoaded = true;
        });
    }

</script>

<Dialog
    bind:open
    aria-labelledby="large-scroll-title"
    aria-describedby="large-scroll-content"
    surface$style="width: 500px; max-width: calc(100vw - 32px);"
    class="manage-project-parameters-dialog"
    >
    <Content>
        <Title style="padding-left:0;" class="project-settings-dialog-title">
            {newProject ? 'Add' : 'Manage' } project
            
        </Title>
        
        {#if !dataLoaded}
        <div style="display: flex; justify-content: center;position:absolute;height:90vh;background-color:rgba(255,255,255,0.5);width: 100%;margin-left:-24px;z-index:12;">
            <CircularProgress style="position:absolute; height: 90vh;width:120px;z-index:12;" indeterminate />
        </div>
        {/if}
        <div>
        {#if fullAccess}
        <p>General info</p>
        <div>
            <LayoutGrid style="padding:0;">
                <Cell span={6}>
                    <Textfield required variant="filled" class="text-field" bind:value={project.Name} label="Name"/>
                </Cell>
                <Cell span={6}>
                    <Textfield required variant="filled" disabled class="text-field" bind:value={project.BucketName} label="Bucket name"></Textfield>
                </Cell>
                <Cell span={6}>
                    <Textfield required variant="filled" class="text-field" bind:value={project.LivingArea} label="Living area"></Textfield>
                </Cell>
                <Cell span={6}>
                    <Textfield required variant="filled" class="text-field" bind:value={project.RoomsNumber} type="number" label="Rooms number"></Textfield>
                </Cell>
                </LayoutGrid>
        </div>
        {/if}
        
        <ProjectSettings
            bind:foundationMaterialValue={project.FoundationMaterial}
            bind:wallMaterialValue={project.WallMaterial}
            bind:finishMaterialValue={project.FinishMaterial}
            bind:roofingMaterialValue={project.RoofingMaterial}
            bind:constructionWorkersNumberValue={project.ConstructionWorkersNumber}>
        </ProjectSettings>

        {#if fullAccess}
        <div class="project-properties">
            <p>Properties</p>
            <LayoutGrid style="padding:0;">
            {#if newProject}
                {#each properties as prop}
                <Cell span={6}>
                {#if prop.PropertyUnit == 'sq.m.'}

                        <Textfield
                            required 
                            variant="filled"
                            input$step="0.01"
                            type="number"
                            class="text-field"
                            bind:value={prop.PropertyValue}
                            label="{prop.PropertyName}"/>
                    {:else}
                        <Textfield
                            required
                            variant="filled"
                            type="number"
                            class="text-field"
                            bind:value={prop.PropertyValue}
                            label="{prop.PropertyName}"/>
                {/if}
                </Cell>
                {/each}
            {:else}
                {#each project.ProjectProperties as prop}
                <Cell span={6}>
                    {#if prop.PropertyUnit == 'sq.m.'}
                        <Textfield
                            required 
                            variant="filled"
                            input$step="0.01"
                            type="number"
                            class="text-field"
                            bind:value={prop.PropertyValue}
                            label="{prop.PropertyName}"/>
                    {:else}
                        <Textfield
                            required
                            variant="filled"
                            type="number"
                            class="text-field"
                            bind:value={prop.PropertyValue}
                            label="{prop.PropertyName}"/>
                    {/if}
                    </Cell>
                {/each}
            {/if}
            </LayoutGrid>
            </div>
        {/if}
    </div>
    </Content>
    <Actions style="padding-right:20px;">
        <Button>
            <ButtonLabel>Cancel</ButtonLabel>
        </Button>
        <Button on:click$preventDefault={newProject ? addProject : updateProject}>
            <ButtonLabel>Done</ButtonLabel>
        </Button>
    </Actions>
</Dialog>

<style>
    :global(.material-select) {
        margin: 10px 0 10px 0;
    }
    :global(.text-field) {
        margin: 10px 0 10px 0;
    }

    @media only screen and (min-width: 600px) and (max-width: 839px) {
        :global(.manage-project-parameters-dialog .mdc-layout-grid__cell) {
            grid-column-end: span 4;
        }
    }

    @media only screen and (max-width: 600px) {
        :global(.manage-project-parameters-dialog .mdc-layout-grid__cell) {
            grid-column-end: span 6;
        }

        :global(.material-select) {
            width: 100%;
        }

        :global(.text-field) {
            width: 100%;
        }
    }
</style>
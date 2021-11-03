<script>
    import Dialog, { Title, Content, Actions } from '@smui/dialog';
    import Button, { Label as ButtonLabel } from '@smui/button';
    import Textfield from '@smui/textfield';

    import ProjectSettings from '../project/project-settings.svelte';

    import { onMount } from 'svelte';

    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    let jobs = [];
    export let properties = [];

    let errorMessage = '';

    export let open;
    export let newProject;
    export let project = {};
    project.Name= '';
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

        project.ProjectJobs = projectJobs;
    }

    async function addProject(event) {
        event.preventDefault();
        event.stopPropagation();

        setProjectJobs();

        project.ProjectProperties = properties;

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
            open = false;
        })
        .catch(error => {
            errorMessage = 'Something went wrong! Try again later';
            console.error(error);
        });
    }

    onMount(function() {
        fetch(api + '/getProperties')
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
        });

        fetch(api + '/getJobs')
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
    });

    async function updateProject(event) {
        event.preventDefault();
        event.stopPropagation();
        setProjectJobs();

        await fetch(api + '/updateProject/'+ project.ProjectId,
        {
            method: 'PUT',
            body: JSON.stringify(project)
        })
        .then((result) => {
            if (result.ok) {
                console.log("Updated successfully");
                dispatch("update");
            }

            return result.json();
        })
        .then((data) => {
            let updatedProject = data.data;

            //wait for all data to be loaded
            updatedProject.ProjectJobs = [];

            project = updatedProject;
            open = false;
        })
        .catch(error => {
            errorMessage = 'Something went wrong! Try again later';
            console.error(error);
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
        <Title class="project-settings-dialog-title">Add project</Title>
        <p>General info</p>
        {#if errorMessage !== ''}
            <div>{errorMessage}</div>
        {/if}
        <div>
            <Textfield required variant="filled" class="text-field" bind:value={project.Name} label="Name"/>
            <Textfield required variant="filled" disabled class="text-field" bind:value={project.BucketName} label="Bucket name"></Textfield>
            <Textfield required variant="filled" class="text-field" bind:value={project.LivingArea} label="Living area"></Textfield>
            <Textfield required variant="filled" class="text-field" bind:value={project.RoomsNumber} type="number" label="Rooms number"></Textfield>
        </div>
        
        <ProjectSettings
            bind:foundationMaterialValue={project.FoundationMaterial}
            bind:wallMaterialValue={project.WallMaterial}
            bind:finishMaterialValue={project.FinishMaterial}
            bind:roofingMaterialValue={project.RoofingMaterial}
            bind:constructionWorkersNumberValue={project.ConstructionWorkersNumber}>
        </ProjectSettings>
        <div class="project-properties">
            <p>Properties</p>
            {#if newProject}
                {#each properties as prop}
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
                {/each}
            {:else}
                {#each project.ProjectProperties as prop}
                    {#if !!prop.Property}
                        {#if prop.Property.PropertyUnit == 'sq.m.'}
                            <Textfield
                                required 
                                variant="filled"
                                input$step="0.01"
                                type="number"
                                class="text-field"
                                bind:value={prop.PropertyValue}
                                label="{prop.Property.PropertyName}"/>
                        {:else}
                            <Textfield
                                required
                                variant="filled"
                                type="number"
                                class="text-field"
                                bind:value={prop.PropertyValue}
                                label="{prop.Property.PropertyName}"/>
                        {/if}
                    {/if}
                {/each}
            {/if}
        </div>
    </Content>
    <Actions>
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
        margin: 10px;
    }
    :global(.text-field) {
        margin: 10px;
    }
</style>
<script>
    import Dialog, { Title, Content, Actions } from '@smui/dialog';
    import Button, { Label as ButtonLabel } from '@smui/button';
    import Textfield from '@smui/textfield';

    import ProjectSettings from '../project/project-settings.svelte';

    import { onMount } from 'svelte';

    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    let jobs = [];

    let errorMessage = '';

    export let open;
    export let newProject;
    export let project;
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
    project.ConstructionDuration= '';
    project.ProjectProperties= [];
    project.ProjectJobs= [];
    project.CompanyName= 'Construction';

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
        console.log(wallJobs.length + ' proj ' + projectJobs.length)
        projectJobs = projectJobs.concat(foundationJobs);
        console.log(foundationJobs.length + ' proj ' + projectJobs.length)
        projectJobs = projectJobs.concat(roofingJobs);
        console.log(roofingJobs.length + ' proj ' + projectJobs.length)
        projectJobs = projectJobs.concat(finishJobs);
        console.log(finishJobs.length + ' proj ' + projectJobs.length)

        project.ProjectJobs = projectJobs;
    }

    async function addProject(event) {
        event.preventDefault();
        event.stopPropagation();

        let formData = {
            name: name,
            livingArea: livingArea,
            filename: name + ".rvt",
            roomsNumber: roomsNumber,
            foundationMaterial: foundationMaterialValue,
            wallMaterial: wallMaterialValue,
            finishMaterial: finishMaterialValue,
            roofingMaterial: roofingMaterialValue,
            constructionCompanyName: companyName,
            constructionWorkersNumber: constructionWorkersNumberValue,
            projectProperties: properties,
            projectJobs: projectJobs
        }

        await fetch(api + '/create',
        {
            method: 'POST',
            body: JSON.stringify(formData)
        })
        .then((result) => {
            if (result.ok) {
                console.log("Add successfully");
               
            }

            return result.json();
        })
        .then((data) => {
            console.log(data);
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

            console.log(result);
            return result.json();
        })
        .then((resp) => {
            resp.data.forEach(element => {
                element.PropertyValue = null;
            });

            project.ProjectProperties = resp.data;
        });

        fetch(api + '/getJobs')
        .then((result) => {
            if (result.ok) {
                console.log("get jobs successfully");
            }

            console.log(result);
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
            }

            return result.json();
        })
        .then((data) => {
            console.log(data);
            project = data.data;
            open = false;
        })
        .catch(error => {
            errorMessage = 'Something went wrong! Try again later';
            console.error(error);
        });
        console.log(project);
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
    :global(.text-field) {
        margin: 10px;
    }
</style>
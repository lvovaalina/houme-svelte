<script>
    import Dialog, { Title, Content, Actions } from '@smui/dialog';
    import Button, { Label as ButtonLabel } from '@smui/button';
    import Textfield from '@smui/textfield';

    import ProjectSettings from '../project/project-settings.svelte';

    import { onMount } from 'svelte';

    export let open;

    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    let name = '', bucketName = 'houmly', livingArea = '';
    let roomsNumber = null;

    let errorMessage = '';

    export let foundationMaterialValue = null;
    export let wallMaterialValue = null;
    export let finishMaterialValue = null;
    export let roofingMaterialValue = null;
    export let constructionWorkersNumberValue = null;

    export let properties = [];
    let jobs = [];

    let companyName = 'Construction';

    const api = isProduction
        ? "https://houme-api.herokuapp.com"
        : "http://localhost:10000";

    async function addProject(event) {
        event.preventDefault();
        event.stopPropagation();

        let wallJobs = jobs
            .filter(j => j.StageName.toLowerCase() == 'walls'
                && j.WallMaterial.toLowerCase() == wallMaterialValue.toLowerCase());
        
        let foundationJobs = jobs
            .filter(j => j.StageName.toLowerCase() == 'foundation'
                && j.FoundationMaterial.toLowerCase() == foundationMaterialValue.toLowerCase());
        
        let finishJobs = jobs
            .filter(j => j.StageName.toLowerCase() == 'exterior decoration of the house'
                && j.FinishMaterial.toLowerCase() == foundationMaterialValue.toLowerCase());
        
        let roofingJobs = jobs
            .filter(j => j.StageName.toLowerCase() == 'roof'
                && j.RoofingMaterial.toLowerCase() == roofingMaterialValue)
        
        let projectJobs = jobs.filter(j => j.Required == true);
        projectJobs.concat(wallJobs);
        projectJobs.concat(foundationJobs);
        projectJobs.concat(roofingJobs);
        projectJobs.concat(finishJobs);

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

            properties = resp.data;
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
            console.log(jobs);
        });
    });

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
            <Textfield required variant="filled" invalid={name.isInvalid} class="text-field" bind:value={name} label="Name"/>
            
            <Textfield required variant="filled" disabled class="text-field" bind:value={bucketName} label="Bucket name"></Textfield>
            <Textfield required variant="filled" class="text-field" bind:value={livingArea} label="Living area"></Textfield>
            <Textfield required variant="filled" class="text-field" bind:value={roomsNumber} type="number" label="Rooms number"></Textfield>
        </div>
        
        <ProjectSettings
            bind:foundationMaterialValue
            bind:wallMaterialValue
            bind:finishMaterialValue
            bind:roofingMaterialValue
            bind:constructionWorkersNumberValue>
        </ProjectSettings>
        <div class="project-properties">
            <p>Properties</p>
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
        </div>
    </Content>
    <Actions>
        <Button>
            <ButtonLabel>Cancel</ButtonLabel>
        </Button>
        <Button on:click$preventDefault={addProject}>
            <ButtonLabel>Done</ButtonLabel>
        </Button>
    </Actions>
</Dialog>

<style>
    :global(.text-field) {
        margin: 10px;
    }
</style>
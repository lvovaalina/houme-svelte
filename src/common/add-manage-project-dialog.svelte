<script>
    import Dialog, { Title, Content, Actions } from '@smui/dialog';
    import Button, { Label as ButtonLabel } from '@smui/button';
    import CircularProgress from '@smui/circular-progress';
    import Textfield from '@smui/textfield';
    import LayoutGrid, { Cell } from "@smui/layout-grid";

    import { propertiesStored } from '../store';

    import ProjectSettings from '../project/project-settings.svelte';

    import { onMount } from 'svelte';

    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    import { getNotificationsContext } from 'svelte-notifications';
    const { addNotification } = getNotificationsContext();

    let dataLoaded = true;
    export let fullAccess = false;

    export let properties = [];

    let errorMessage = '';

    export let open;
    export let newProject;
    export let project = {};
    let files = [];
    project.ProjectId = 0;
    project.Name = '';
    project.Filename = '';
    project.BucketName = 'houmly';
    project.LivingArea= '';
    project.ConstructonWorkersNumber= '';
    project.WallMaterial= '';
    project.FoundationMaterial= '';
    project.FinishMaterial= '';
    project.RoofingMaterial= '';
    project.ConstructionCost = 0;
    project.ConstructionDuration= 0;
    project.ProjectProperties= [];
    project.ProjectJobs= [];
    project.ConstructionCompanyName= 'Construction';
    project.Margin = '';
    project.Workers = '';
    project.ProjectCover = null;

    import { config } from '../config';
    let conf = new config();

    function setCover(files) {
        if (!!files && files.length > 0) {
            let image = files[0];
            let reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = e => {
                project.ProjectCoverBase64 = e.target.result;
            };
        }
    }

    $:setCover(files);

    async function addProject(event) {
        dataLoaded = false;
        event.preventDefault();
        event.stopPropagation();

        project.ProjectProperties = properties;

        await fetch(conf.api + '/auth/create',
        {
            method: 'POST',
            body: JSON.stringify(project),
            credentials: 'include',
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
        files = [];
        if ($propertiesStored.length == 0) {
            let getProperties = fetch(conf.api + '/getProperties')
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
        } else {
            properties = $propertiesStored;
            dataLoaded = true;
        }
    });

    async function updateProject(event) {
        dataLoaded = false;
        event.preventDefault();
        event.stopPropagation();

        project.ProjectCoverBase64 = project.ProjectCoverBase64.replace('data:image/png;base64,', '');

        await fetch(conf.api + '/auth/updateProject/'+ project.ProjectId,
        {
            method: 'PUT',
            body: JSON.stringify(project),
            credentials: 'include',
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

            //wait for all data to be loaded
            updatedProject.ProjectJobs = [];

            project = updatedProject;
            open = false;
            project = {};
            files = [];
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
                    <Textfield required variant="filled" class="text-field" bind:value={project.Margin} label="Margin"></Textfield>
                </Cell>
                <Cell span={6}>
                    <Textfield required variant="filled" class="text-field" bind:value={project.Workers} label="Workers"></Textfield>
                </Cell>
                <Cell span={6}>
                    <Textfield required variant="filled" class="text-field" bind:value={project.Filename} label="Urn"></Textfield>
                </Cell>
                <Cell span={6}>
                    <Textfield bind:files={files} accept=".png" label="File" type="file" />
                </Cell>
                </LayoutGrid>
            {#if !!project.ProjectCoverBase64}
                <div>
                    <img class="project-image" src="{project.ProjectCoverBase64}" alt="Project cover"/>
                </div>
            {/if}
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
    .project-image {
        height: 50px;
        width: 100px;
        margin-top: 5px;
    }

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
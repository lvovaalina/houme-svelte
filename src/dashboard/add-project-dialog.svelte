<script>
    import Dialog, { Title, Content, Actions } from '@smui/dialog';
    import Button, { Label as ButtonLabel } from '@smui/button';
    import Textfield from '@smui/textfield';
    export let open;
    import ProjectSettings from '../project/project-settings.svelte';

    let name = '', bucketName = 'houmly', livingArea = '';
    let roomsNumber = 0;

    export let foundationMaterialValue = 'Tape';
    export let wallMaterialValue = 'CLT';
    export let finishMaterialValue = 'Plaster';
    export let roofingMaterialValue = 'Seam Roof';
    export let constructionWorkersNumberValue = 'Optimal';

    const api = isProduction
        ? "https://houme-api.herokuapp.com"
        : "http://localhost:10000";

    function addProject() {
        let formData = {
            name: name,
            livingArea: livingArea,
            roomsNumber: roomsNumber,
            foundationMaterial: foundationMaterialValue,
            wallMaterial: wallMaterialValue,
            finishMaterial: finishMaterialValue,
            roofingMaterial: roofingMaterialValue,
            constructionWorkersNumber: constructionWorkersNumberValue
        }
        fetch(api + '/add',
        {
            method: 'POST',
            body: JSON.stringify(formData)
        })
        .then((result) => {
            if(result.ok) {
                console.log("Add successfully");
            }
        })
        
    }

    function log() {
        console.log(name);
        console.log(constructionWorkersNumberValue);
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
        <div>
            <Textfield variant="filled" class="text-field" bind:value={name} label="Name"/>
            <Textfield variant="filled" disabled class="text-field" bind:value={bucketName} label="Bucket name"></Textfield>
            <Textfield variant="filled" class="text-field" bind:value={livingArea} label="Living area"></Textfield>
            <Textfield variant="filled" class="text-field" bind:value={roomsNumber} type="number" label="Rooms number"></Textfield>
        </div>
        <ProjectSettings
            bind:foundationMaterialValue
            bind:wallMaterialValue
            bind:finishMaterialValue
            bind:roofingMaterialValue
            bind:constructionWorkersNumberValue>
        </ProjectSettings>
        <Button on:click={log}><ButtonLabel>Log</ButtonLabel></Button>
    </Content>
    <Actions>
        <Button>
            <ButtonLabel>Cancel</ButtonLabel>
        </Button>
        <Button on:click={addProject} action="accept">
            <ButtonLabel>Done</ButtonLabel>
        </Button>
    </Actions>
</Dialog>

<style>
    :global(.text-field) {
        margin: 10px;
    }
</style>
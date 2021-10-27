<script>
    import Dialog, { Title, Content, Actions } from '@smui/dialog';
    import Button, { Label as ButtonLabel } from '@smui/button';
    import ProjectSettings from './project-settings.svelte';

    export let open;

    export let stages;
</script>

<Dialog
    bind:open
    aria-labelledby="large-scroll-title"
    aria-describedby="large-scroll-content"
    surface$style="width: 500px; max-width: calc(100vw - 32px);"
    class="manage-project-parameters-dialog"
    >
    <Content id="large-scroll-content">
        <div class="columns margins">
            <Title class="project-settings-dialog-title">Project Settings</Title>
            <ProjectSettings></ProjectSettings>
        </div>
    </Content>
    <Actions>
        <Button>
            <ButtonLabel>Cancel</ButtonLabel>
        </Button>
        <Button action="accept">
            <ButtonLabel>Done</ButtonLabel>
        </Button>
    </Actions>
</Dialog>

<style>
    /* .materials-setting, .construction-workers-setting {
        display: flex;
        justify-content: left;
        margin-bottom: 10px;
    } */

    :global(.material-select) {
        margin: 10px;
    }

    :global(.project-settings-dialog-title) {
        padding: 0;
    }
</style>
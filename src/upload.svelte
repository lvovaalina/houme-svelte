<script>
    import { createEventDispatcher } from "svelte";
    import Card, { Content, Actions } from "@smui/card"
    import Button, {Label} from "@smui/button"
    import Dropzone from "svelte-file-dropzone"

    const dispatch = createEventDispatcher();

    function addProject() {
        let fileName = files.accepted.length !== 0
            ? files.accepted[files.accepted.length - 1].name
            : "";
        dispatch("add", fileName);
        files.accepted = [];
    }

    function isDirty() {
        return files.accepted.length === 0;
    }

    let files = {
        accepted: [],
        rejected: []
    };

    function handleFilesSelect(e) {
        const { acceptedFiles, fileRejections } = e.detail;
        files.accepted = [...files.accepted, ...acceptedFiles];
        files.rejected = [...files.rejected, ...fileRejections];
    }

    export let bucketName;
</script>

<div class="card-container">
    <Card outline>
        <Content>
            <h2 class="mdc-typography--headline6" style="margin: 0;">
                Upload Project
            </h2>
            <p>Bucket: {bucketName}</p>

            <Dropzone on:drop={handleFilesSelect} multiple="false" accept=".rvt" />
            {#if (files.accepted.length !== 0)}
                <p>fileName: {files.accepted[files.accepted.length - 1].name}</p>
            {/if}
        </Content>
        <Actions fullBleed>
            <Button on:click={addProject} disabled={isDirty(files.accepted)}>
                <Label>Upload project</Label>
                <i class="material-icons" aria-hidden="true">arrow_forward</i>
            </Button>
        </Actions>
    </Card>
</div>

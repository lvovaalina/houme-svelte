<script>
    import { createEventDispatcher } from "svelte";
    import Card, { Content, Actions } from "@smui/card";
    import Button, {Label} from "@smui/button";
    import Dropzone from "svelte-file-dropzone";
    import { Jumper } from 'svelte-loading-spinners'

    import { getNotificationsContext } from 'svelte-notifications';
    const { addNotification } = getNotificationsContext();

    import { config } from '../config';
    let conf = new config();
    let isLoading = false;

    const dispatch = createEventDispatcher();
    let files = {
        accepted: [],
        rejected: []
    };

    function uploadFile(e) {
        isLoading = true;
        let file = files.accepted[files.accepted.length - 1];
        let formData = new FormData();
        formData.append("file", file)

        fetch(conf.api  + '/auth/forge/upload', {
            method: 'POST',
            body: formData,
            credentials: 'include',
        }).then((response) => {
            isLoading = false;
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(response);
            }
        }).then((data) => {
            addNotification({
                id: Date.now(),
                text: data.message + '. Sending translation request. Filename: ' + file.name + '.',
                position: 'top-center',
            });
            return fetch(conf.api  + '/auth/translate', {
                method: 'POST',
                body: JSON.stringify({ fileName : file.name }),
                credentials: 'include',
            });
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(response);
            }
        }).then((data) => {
            files.accepted = [];
            addNotification({
                id: Date.now(),
                text: 'Translate request has been successfully send. Filename: ' + file.name + '.',
                position: 'top-center',
            });
            dispatch("add", { fileName: file.name });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    function isDirty() {
        return files.accepted !== null && files.accepted.length === 0;
    }

    function handleFilesSelect(e) {
        const { acceptedFiles, fileRejections } = e.detail;
        files.accepted = [...files.accepted, ...acceptedFiles];
        files.rejected = [...files.rejected, ...fileRejections];
    }
</script>

<div class="card-container">
    <Card outline>
        <Content>
            <h2 class="mdc-typography--headline6" style="margin: 0;">
                Upload Project
            </h2>
            <p>Bucket: houmly</p>

            {#if isLoading}
            <div style="display: flex; justify-content: center">
                <Jumper size="60" color="#6200ee" unit="px" duration="1s"></Jumper>
            </div>
            {:else}
                <Dropzone on:drop={handleFilesSelect} multiple="false" accept=".rvt" />
                {#if (files.accepted.length !== 0)}
                    <p>File Name: {files.accepted[files.accepted.length - 1].name}</p>
                {/if}
            {/if}
        </Content>
        <Actions fullBleed>
            <Button on:click={uploadFile} disabled={isDirty(files.accepted)}>
                <Label>Upload project</Label>
                <i class="material-icons" aria-hidden="true">arrow_forward</i>
            </Button>
        </Actions>
        
    </Card>
</div>

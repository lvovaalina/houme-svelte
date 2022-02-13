<script>
    import Textfield from '@smui/textfield';
    import Dropzone from 'svelte-file-dropzone';
    import Button, { Label } from '@smui/button';
    import CircularProgress from '@smui/circular-progress';

    import { config } from '../config';
    let conf = new config();

    let isLoading = false;
    let errorMessage = null;
    let name = null;
    let email = null;

    let files = {
        accepted: [],
        rejected: []
    };

    function handleFilesSelect(e) {
        const { acceptedFiles, fileRejections } = e.detail;
        files.accepted = [...files.accepted, ...acceptedFiles];
        files.rejected = [...files.rejected, ...fileRejections];
    }

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    function uploadFile(e) {
        isLoading = true;
        let file = files.accepted[files.accepted.length - 1];
        let formData = new FormData();

        if (!name || !email) {
            errorMessage = "Please fill in name and email to send a file."
            return;
        }

        if (!validateEmail(email)) {
            errorMessage = "Please add a valid email";
            return;
        }

        if (!file) {
            errorMessage = "Please attach file to send."
            return;
        }

        formData.append("file", file);
        formData.append("name", name);
        formData.append("email", email);

        fetch(conf.api  + '/uploadModel', {
            method: 'POST',
            body: formData,
            credentials: 'include',
        }).then((response) => {
            files = {
                accepted: [],
                rejected: []
            };
            name = null;
            email = null;

            isLoading = false;
            if (response.ok) {
                errorMessage = null;
                return response.json();
            } else {
                return Promise.reject(response);
            }
        })
        .catch((error) => {
            errorMessage = "Oops! Something went wrong. Try again later"
            console.error('Error:', error);
        });
    }
</script>

<div class="upload-model-container">
    {#if !isLoading}
    <h1>Do you want to see your plan?</h1>
    <form on:submit|preventDefault={uploadFile} style="display:flex">
        <div style="width:50%">
        {#if errorMessage!= null}
            <p style="color:red;">{errorMessage}</p>
        {/if}

        <label for="name">Name</label>
        <Textfield
            id="name" required variant="outlined"
            style="width:70%; height:40px;" class="text-field"
            bind:value={name}/>

        <label for="email">Email</label>
        <Textfield
            id="email" required variant="outlined"
            style="width:70%; height:40px;" class="text-field"
            bind:value={email}/>
        </div>

        <div class="upload-project-container" style="width:50%">
            <Dropzone containerClasses="project-upload" on:drop={handleFilesSelect} multiple="false" accept=".rvt">
                <p>Drag and drop or Click</p>
            </Dropzone>
            {#if (files.accepted.length !== 0)}
                <p>File Name: {files.accepted[files.accepted.length - 1].name}</p>
            {/if}

            <Button style="margin-top: 15px;" variant="raised" type="submit">
                <Label>Upload Model</Label>
            </Button>
        </div>
    </form>
    <h2>Upload your project in any format and see how easy planning process can be</h2>
    {:else}
    <div style="display: flex; justify-content: center;position:absolute;height:90vh;background-color:rgba(255,255,255,0.5);width: 100%;margin-left:-24px;z-index:12;">
        <CircularProgress style="position:absolute; height: 90vh;width:120px;z-index:12;" indeterminate />
    </div>
    {/if}
</div>
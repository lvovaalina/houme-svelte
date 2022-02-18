<script>
    import Textfield from '@smui/textfield';
    import Dropzone from 'svelte-file-dropzone';
    import Button, { Label } from '@smui/button';
    import Card, { Content } from '@smui/card';
    import { pageTitle } from '../store';
    import CircularProgress from '@smui/circular-progress';

    import { config } from '../config';
    let conf = new config();

    pageTitle.set({
        title: 'Get plan',
    })

    let isLoading = false;
    let isFileLoading = false;
    let showSuccessMessage = false;
    let errorMessage = null;
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
        isFileLoading = true;

        let file = files.accepted[files.accepted.length - 1];
        let formData = new FormData();

        if (!email) {
            errorMessage = "Please fill in name and email to send a file.";
            isFileLoading = false;
            return;
        }

        // if (!validateEmail(email)) {
        //     errorMessage = "Please add a valid email";
        //     return;
        // }

        if (!file) {
            errorMessage = "Please attach file to send.";
            isFileLoading = false;
            return;
        }

        formData.append("file", file);
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
            email = null;

            isFileLoading = false;
            if (response.ok) {
                errorMessage = null;
                showSuccessMessage = true;
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

    function getSizeString(size) {
        let mbSize = Math.round(size/(1024*1024));
        if (mbSize> 0) {
            return mbSize + 'MB';
        } else {
            return Math.round(size/1024) + 'KB';
        }

    }
</script>

<div>
    <div class="upload-model-container">
    <Card class="upload-model-card">
        <Content style="padding: 50px 90px;">
            {#if !showSuccessMessage}
                <h1>Get your plan</h1>
            {/if}
           
            {#if showSuccessMessage}
                <div style="text-align:center;">
                    <img alt="check" src="/check.svg" />
                    <h1>Thank you!</h1>
                    <!-- <h1>Successfully uploaded project!</h1> -->
                    <p>We will get back to you as soon as possible</p>
                    <Button style="border-color:#2D62E8;height: 48px;" on:click={()=>showSuccessMessage=false} variant="outlined">
                        <Label>Upload More</Label>
                    </Button>
                </div>
            {:else if isFileLoading}
                <div style="display:flex; justify-content: center;">
                    <CircularProgress style="height: 200px; width: 100px;" indeterminate />
                </div>
            {:else if !showSuccessMessage}
                <p style="margin: 10px -40px;">Upload your project and we will email you the construction 
                    plan with Gantt diagram and materials you will need!</p>
                <Dropzone containerClasses="project-upload" on:drop={handleFilesSelect}
                    maxSize="{300 * 1024 * 1024}" multiple="false"
                    accept=".rvt, .dwg, .dwf, .dxfm, .3ds, .png, .pdf, .jpg, .ifc, .bcf">
                    <img alt="upload model to cloud" src="/upload-cloud.svg"/>
                    <div style="display: flex;">
                        <p style="color: rgba(0,100,200)">Click to upload&nbsp;</p>
                        <p>or drag and drop</p>
                    </div>
                    <p style="margin:0;font-size: 12px; line-height: 16.8px; text-align: center;">
                        rvt, dwg, dwf, dxf, 3ds, png, pdf, jpg, ifc, bcf
                    </p>
                    <p style="margin:0;font-size: 12px; line-height: 16.8px; text-align: center;">
                        Max size 300 Mb
                    </p>
                </Dropzone>
                {#if (files.rejected.length !== 0)}
                    <div class="accepted-file-container">
                        <p style="color:red;">Could not upload file!</p>
                        <p>Please check file size and extension.</p>
                    </div>
                    
                {:else if (files.accepted.length !== 0)} 
                    <div class="accepted-file-container">
                        <p>{files.accepted[files.accepted.length - 1].name}</p>
                        <p style="font-weight: 500;font-size: 12px;color: #6B6D76;">
                            {getSizeString(files.accepted[files.accepted.length - 1].size)}
                        </p>
                    </div>
                {/if}

                <Textfield
                    id="email" required variant="outlined"
                    style="height:48px; width: 100%; margin-top: 15px;" class="text-field"
                    label="Email"
                    bind:value={email}/>
                <Button style="width: 100%; height:48px;" variant="raised" on:click={uploadFile}>
                    <Label>Get Plan</Label>
                </Button>
            {/if}

        </Content>
    </Card>
    
    </div>
    <div>
        <h2>See how companies plan their process</h2>
    </div>
   
</div>

<style>
    .accepted-file-container {
        border: 1px solid #D9DEE7;
        border-radius: 5px;
        margin-top: 15px;
        padding: 15px;
    }

    .accepted-file-container p {
        text-align: left;
        color: black;
        margin: 0;
    }

    .upload-model-container {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 30px;
    }

    :global(.upload-model-container .mdc-button__label) {
        text-transform: capitalize;
        font-weight: 800;
        font-size: 16px;
        line-height: 18.4px;
    }

    :global(.mdc-notched-outline__leading, .mdc-notched-outline__notch, .mdc-notched-outline__trailing) {
        border-color: #D9DEE7 !important;
    }

    :global(
        .mdc-text-field--invalid .mdc-notched-outline__leading,
        .mdc-text-field--invalid .mdc-notched-outline__notch,
        .mdc-text-field--invalid .mdc-notched-outline__trailing) {
        border-color: #b00020 !important;
    }

    :global(.mdc-text-field--focused .mdc-notched-outline__notch span) {
        color: #2D62E8 !important;
    }

    h1, h2 {
        text-align: center;
        font-size: 40px;
        font-weight: 800;
        line-height: 46px;
    }

    h1 {
        margin: 0;
    }

    p {
        text-align: center;
        font-weight: 500;
        font-size: 16px;
        line-height: 22.4px;
        color: #6B6D76;
    }

    :global(.project-upload) {
        padding: 34px !important;
    }

    :global(.upload-model-card) {
        width: 40%;
    }

    @media only screen and (max-width:1289px)
    {
        :global(.upload-model-card) {
            width: 80%;
        }
    }

    @media only screen and (max-width:839px)
    {
        :global(.upload-model-card) {
            width: 100%;
        }
    }
</style>
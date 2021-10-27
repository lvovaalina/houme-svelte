<script>
    import Button, { Label } from "@smui/button"
    import Card, { Content, Actions } from "@smui/card"

    import { createEventDispatcher } from "svelte";

    export let fileName;
    export let bucketName;
    export let urn;

    const api = isProduction
        ? "https://houme-api.herokuapp.com"
        : "http://localhost:10000";

    const dispatch = createEventDispatcher();

    function deleteProject() {
        fetch(api + '/deleteFile', {
            method: 'DELETE',
            body: JSON.stringify({ fileName : fileName })
        })
        .then((response) => {
            if (response.ok) {
                dispatch("delete", { fileName: fileName})
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

</script>

<div class="card-container">
    <Card outline>
        <Content>
            <h2 class="mdc-typography--headline6" style="margin: 0;">
                Project
            </h2>
            <p>File: {fileName}</p>
            <p>Bucket: houmly</p>
        </Content>
        <Actions fullBleed>
            <Button href="/view/{urn}">
                <Label>View</Label>
                <i class="material-icons" aria-hidden="true">arrow_forward</i>
            </Button>
            <Button on:click={deleteProject}>
                <Label>Delete</Label>
                <i class="material-icons" aria-hidden="true">arrow_forward</i>
            </Button>
        </Actions>
    </Card>
</div>

<style>
    .card-container a{
        text-decoration: none;
    } 
</style>
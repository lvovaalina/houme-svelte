<script>
    import Button, { Label } from "@smui/button"
    import Card, { Content, Actions } from "@smui/card"

    export let fileName;
    export let bucketName;

</script>

<div class="card-container">
    <Card outline>
        <Content>
            <h2 class="mdc-typography--headline6" style="margin: 0;">
				Project
			</h2>
            <p>File: {fileName}</p>
            <p>Bucket: {bucketName}</p>
        </Content>
        <Actions fullBleed>
            <Button>
            <!-- <Button on:click={() => clicked++}> -->
                <Label>View</Label>
                <i class="material-icons" aria-hidden="true">arrow_forward</i>
            </Button>
            <Button>
            <!-- <Button> on:click={() => clicked++}> -->
                <Label>Update</Label>
                <i class="material-icons" aria-hidden="true">arrow_forward</i>
            </Button>
        </Actions>
    </Card>
</div>

<style>
    .card-container p, .card-container h2 {
        text-align: start;
    }
</style>
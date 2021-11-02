<script>
    import Dialog, {Title, Content, Actions} from '@smui/dialog';
    import Button, { Label } from '@smui/button';

    export let open;
    export let projectId;

    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    const api = isProduction
        ? "https://houme-api.herokuapp.com"
        : "http://localhost:10000";

    function deleteProject() {
        fetch(api + '/deleteProject/' + projectId, {
            method: 'DELETE'
        })
        .then((response) => {
            if (response.ok) {
                dispatch("delete", { projectId: projectId });
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
</script>

<Dialog
  bind:open
  aria-labelledby="simple-title"
  aria-describedby="simple-content"
>
  <!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
  <Title id="simple-title">Delete Project</Title>
  <Content id="simple-content">Are you sure you want to delete project?</Content>
  <Actions>
    <Button>
      <Label>No</Label>
    </Button>
    <Button on:click={deleteProject}>
      <Label>Yes</Label>
    </Button>
  </Actions>
</Dialog>
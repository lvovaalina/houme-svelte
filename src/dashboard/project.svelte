<script>
    import Button, { Label } from "@smui/button"
    import Card, { Content, Actions } from "@smui/card"

    import { createEventDispatcher } from "svelte";

    export let project;

    const dispatch = createEventDispatcher();

    function deleteProject() {
        dispatch("openDeleteProjectDialog", { projectId: project.ProjectId});
    }

</script>

<div class="card-container">
    <Card class="project-card" outline>
        <Content>
            <h2 class="mdc-typography--headline6" style="margin: 0;">
                Project {project.Name}
            </h2>
            <div class="project-card-content">
                <div>
                    <div class="properties">
                        <p>Rooms number: {project.RoomsNumber}</p>
                        <p>Space: {project.LivingArea}</p>
                        <p>Construction Cost: {project.ConstructionCost}$</p>
                        <p>Construction Duration: {project.ConstructionDuration} days</p>
                    </div>
                </div>
                <div>
                    <img class="card-cover" src="/house.jpeg" alt="House">
                </div>
            </div>
        </Content>
        <Actions class="project-card-actions">
            <Button class="project-card-button" variant="outlined" href="/view/{project.ProjectId}">
                <Label>View</Label>
                <i class="material-icons" aria-hidden="true">arrow_forward</i>
            </Button>
            <Button class="project-card-button" variant="outlined" on:click={deleteProject}>
                <Label>Delete</Label>
                <i class="material-icons" aria-hidden="true">delete</i>
            </Button>
        </Actions>
    </Card>
</div>

<style>
    .project-card-content {
        display: flex;
        justify-content: space-between;
        align-items: end;
    }

    .card-cover {
        height: 103px;
        width: 163px;
    }

    .material-icons {
        margin-left: 10px;
    }

    .properties p {
        margin: 0;
    }

    :global(.project-card-actions) {
        justify-content: space-between;
        padding: 8px 16px;
    }

    :global(.project-card-button) {
        margin-right: 10px;
        width: 45%;
        border-color: #6200ee !important;
    }

    :global(.project-card) {
        background-color: #F6F3F9;
    }

    :global(.card-container a) {
        text-decoration: none;
    }
</style>
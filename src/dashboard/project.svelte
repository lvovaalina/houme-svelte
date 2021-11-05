<script>
    import Button, { Label } from "@smui/button"
    import Card, { Content, Actions } from "@smui/card"

    import { createEventDispatcher } from "svelte";

    export let project;
    export let ind = 0;

    const dispatch = createEventDispatcher();

    function deleteProject() {
        dispatch("openDeleteProjectDialog", { projectId: project.ProjectId});
    }
</script>

<div class="card-container">
    <Card style={ind % 2 == 0 ? "margin-right:25px;" : "margin-left:25px;"}  class="project-card" outline>
        <Content style="padding:20px">
            <div class="card-details-container">
                <div class="card-text-details-container">
                    <h2 class="mdc-typography--headline6" style="margin: 0;">
                        Project {project.Name}
                    </h2>

                   
                    <div class="project-card-content">
                        <!-- <div>
                            <div class="properties">
                                <p>Rooms number: {project.RoomsNumber}</p>
                                <p>Space: {project.LivingArea}</p>
                                <p>Construction Cost: {project.ConstructionCost}$</p>
                                <p>Construction Duration: {project.ConstructionDuration} days</p>
                            </div>
                        </div> -->

                        <table class="property-table" aria-label="Project properties" style="max-width: 100%;">
                            <tr>
                                <td><i class="fas fa-key"></i></td>
                                <td>Rooms Number</td>
                                <td class="numeric-row">{project.RoomsNumber}</td>
                            </tr>
                            <tr>
                                <td><i class="fas fa-house-user"></i></td>
                                <td>Space</td>
                                <td class="numeric-row">{project.LivingArea.replace(" sq.m.", "")}&#13217;</td>
                            </tr>
                            <tr>
                                <td><i class="fas fa-money-bill-wave"></i></td>
                                <td>Project Cost</td>
                                <td class="numeric-row">{project.ConstructionCost} &dollar;</td>
                            </tr>
                            <tr>
                                <td><i class="fas fa-calendar-alt"></i></td>
                                <td>Project Duration</td>
                                <td class="numeric-row">{project.ConstructionDuration} days</td>
                            </tr>

                        </table>
                    </div>
                    <Actions class="project-card-actions">
                        <Button class="project-card-button" variant="outlined" href="/view/{project.ProjectId}">
                            <Label>View</Label>
                            <i class="material-icons" aria-hidden="true">arrow_forward</i>
                        </Button>
                    </Actions>
                </div>
                <div>
                    <img class="card-cover" src="/house.jpeg" alt="House">
                </div>
            </div>
        </Content>
    </Card>
</div>

<style>
    :global(.property-table i) {
        color: #6200ee;
    }

    .numeric-row {
        padding-left: 10px;
    }
    .card-text-details-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .card-details-container {
        display: flex;
        justify-content: space-between;
    }

    .project-card-content {
        display: flex;
        justify-content: space-between;
        align-items: end;
    }

    .card-cover {
        height: 210px;
        width: 315px;
    }

    @media only screen and (min-width: 1500px) {
        .card-cover {
            width: 203px;
        }
    }

    .properties p {
        margin: 0 0 5px 0;
    }

    :global(.project-card-actions) {
        display: block;
        min-height: 0px;
        padding: 0;
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

    :global(.card-container i) {
        font-size: 18px;
        margin-left: 0;
    }
</style>
<script>
    import DataTable, { Body, Head, Row, Cell} from "@smui/data-table";
    import LayoutGrid, { Cell as GridCell} from '@smui/layout-grid';
    import Tooltip, { Wrapper } from '@smui/tooltip';
    import { Icon } from "@smui/common";

    import { onMount } from "svelte";
    import IconButton from "@smui/icon-button/IconButton.svelte";

    export let stages;
    export let projectProperties;

    let columns = ['Color', 'Stage', 'Cost', 'Value', 'Unit', 'People', 'Duration'];
    let jobsCost = 0;
    let estimation = 0;
    let materialsCost = 0;

    onMount(() => {
        stages.forEach(stage => {
            jobsCost += stage.cost;
            estimation += stage.time;
        });

        projectProperties.forEach(prop => {
            materialsCost += prop.cost;
        })
    });
    

    function rowClick(className) {
        let rows = document.getElementsByClassName(className);
        rows.forEach(element => {
            element.classList.toggle("hidden-subtasks")
        });
    }
</script>

<div class="project-cost">

    <LayoutGrid class="costs-grid">
        <GridCell span={2}></GridCell>
        <GridCell span={8}>
            <div class="table-caption">
                <h2>Jobs</h2>
                <div>
                    <p>Cost: {jobsCost}$ | Estimation: {estimation}days</p>
                </div>
            </div>
            <DataTable
                stickyHeader table$aria-label="Construction Stages"
                class="project-stages">
                <Head>
                    <Row>
                    {#each columns as col}
                        {#if col == 'Color'}
                            <Cell>
                                {col}
                                <Wrapper>
                                    <Icon class="material-icons help-icon">help</Icon>
                                    <Tooltip>Stage color in project timeline</Tooltip>
                                </Wrapper>
                            </Cell>
                        {:else}
                            <Cell>{col}</Cell>
                        {/if}
                    {/each}
                    </Row>
                </Head>
                <Body>
                    {#each stages as stage}
                        <Row on:click={rowClick(stage.code)}>
                            <Cell class={stage.color}></Cell>
                            <Cell>{stage.name}</Cell>
                            <Cell numeric>23</Cell>
                            <Cell numeric>33</Cell>
                            <Cell>sq.m</Cell>
                            <Cell numeric>4</Cell>
                            <Cell numeric>{stage.time}</Cell>
                        </Row>
                        {#if stage.tasks && stage.tasks.length !== 0}
                                {#each stage.tasks as task}
                                    <Row class="hidden-subtasks {stage.code}">
                                        <Cell class={stage.color}></Cell>
                                        <Cell>{task.name}</Cell>
                                        <Cell numeric>22</Cell>
                                        <Cell numeric>33</Cell>
                                        <Cell>sq.m</Cell>
                                        <Cell numeric>4</Cell>
                                        <Cell numeric>12</Cell>
                                    </Row>
                                {/each}
                        {/if}
                    {/each}
                </Body>
            </DataTable>
        </GridCell>
    </LayoutGrid>
</div>

<style>
    :global(.costs-grid) {
        padding-top: 0;
    }

    :global(.help-icon) {
        font-size: 14px;
    }

    .table-caption {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .table-caption p {
        display: flex;
    }

    :global(.project-stages, .project-materials) {
        width: 100%;
    }

    @media (max-width: 839px) {
        :global(.project-stages, .project-materials) {
            overflow: scroll;
        }
    }
    
    :global(.hidden-subtasks) {
        display: none;
    }
</style>
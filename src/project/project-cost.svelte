<script>
    import DataTable, { Body, Head, Row, Cell} from "@smui/data-table";
    import Tooltip, { Wrapper } from '@smui/tooltip';
    import { Icon } from "@smui/common";
    import LinearProgress from '@smui/linear-progress';

    export let jobs = [];
    export let estimation = 0;

    export let loaded = false;

    let columns = ['Color', 'Stage', 'Cost', 'Property Name', 'Property Value', 'Property Unit', 'People', 'Duration'];
    let jobsCost = 0;

    function rowClick(className) {
        let rows = document.getElementsByClassName(className);
        rows.forEach(element => {
            element.classList.toggle("hidden-subtasks")
        });
    }
</script>

<div class="project-cost">
    <div class="table-caption">
        <div>
            <p>Cost: {jobsCost}$ | Estimation: {estimation} days</p>
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
            {#each jobs as stage}

                <Row on:click={rowClick(stage.code)}>
                    <Cell class={stage.color}></Cell>
                    <Cell>{stage.name}</Cell>
                    <Cell numeric>{stage.stageCost}</Cell>
                    <Cell>{stage.propertyName}</Cell>
                    <Cell numeric>{stage.propertyValue}</Cell>
                    <Cell>{stage.propertyUnit}</Cell>
                    <Cell numeric>{stage.workersCount}</Cell>
                    <Cell numeric>{stage.duration}</Cell>
                </Row>
                {#if stage.tasks && stage.tasks.length !== 0}
                        {#each stage.tasks as task}
                            <Row class="hidden-subtasks {stage.code}">
                                <Cell class={stage.color}></Cell>
                                <Cell>{task.name}</Cell>
                                <Cell numeric>{task.cost}</Cell>
                                <Cell>{task.propertyName}</Cell>
                                <Cell numeric>{task.propertyValue}</Cell>
                                <Cell>{task.propertyUnit}</Cell>
                                <Cell numeric>{task.workersCount}</Cell>
                                <Cell numeric>{task.duration}</Cell>
                            </Row>
                        {/each}
                {/if}
            {/each}
        </Body>
        <LinearProgress
            indeterminate
            bind:closed={loaded}
            aria-label="Data is being loaded..."
            slot="progress"
        />
    </DataTable>
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

    /*@media (max-width: 839px) {*/
        :global(.project-stages, .project-materials) {
            overflow: scroll;
        }
    /*}*/
    
    :global(.hidden-subtasks) {
        display: none;
    }
</style>
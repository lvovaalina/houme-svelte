<script>
    import DataTable, { Body, Head, Row, Cell} from "@smui/data-table";
    import LayoutGrid, { Cell as GridCell} from '@smui/layout-grid';

    export let stages;
    export let projectProperties;

    let columns = ['Stage', 'Cost', 'Value', 'Unit', 'People', 'Duration'];

    function rowClick(className) {
        let rows = document.getElementsByClassName(className);
        rows.forEach(element => {
            element.classList.toggle("hidden-subtasks")
        });
    }
</script>

<div class="project-cost">
    <LayoutGrid>
        <GridCell span={7}>
            <h2>Stages</h2>
            <DataTable
                stickyHeader table$aria-label="Construction Stages"
                class="project-stages">
                <Head>
                    <Row>
                    {#each columns as col}
                        <Cell>{col}</Cell>
                    {/each}
                    </Row>
                </Head>
                <Body>
                    {#each stages as stage}
                        <Row on:click={rowClick(stage.code)}>
                            <Cell>{stage.name}</Cell>
                            <Cell numeric>23</Cell>
                            <Cell numeric>33</Cell>
                            <Cell>sq.m</Cell>
                            <Cell numeric>4</Cell>
                            <Cell numeric>{stage.time}</Cell>
                        </Row>
                        {#if stage.tasks && stage.tasks.length !== 0}
                                {#each stage.tasks as task}
                                    <Row class="hidden-subtasks {stage.code}" style="background-color: aqua;">
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
        <GridCell span={5}>
            <h2>Materials</h2>
            <DataTable
                stickyHeader table$aria-label="House Parameters"
                style="width:100%;"
                class="project-materials">
                <Head>
                    <Row>
                        <Cell>Name</Cell>
                        <Cell numeric>Value</Cell>
                        <Cell numeric>Cost</Cell>
                    </Row>
                </Head>
                <Body>
                    {#each projectProperties as param}
                        <Row>
                            <Cell>{param.name}</Cell>
                            <Cell numeric>{param.amount}</Cell>
                            <Cell numeric>{param.cost}</Cell>
                        </Row>
                    {/each}
                </Body>
            </DataTable>
        </GridCell>
    </LayoutGrid>
</div>

<style>
    
    :global(.hidden-subtasks) {
        display: none;
    }
</style>
<script>
    import DataTable, { Body, Head, Row, Cell} from "@smui/data-table";
    import LinearProgress from '@smui/linear-progress';

    export let jobs = [];

    export let loaded = false;
    export let currency;

    let columns = ['Stage', 'Cost',  'Duration', 'Property Name', 'Volume', 'Workers'];

    function rowClick(className) {
        let rows = document.getElementsByClassName(className);
        if (rows && rows.length !== 0) {
            rows.forEach(element => {
                element.classList.toggle("hidden-subtasks")
            });

            let row = document.getElementsByClassName(className + '-icon')[0];
            row.classList.toggle('fa-angle-down');
            row.classList.toggle('fa-angle-right');
        }
        
    }

    function colStyle(col) {
        let style;
        if (col == 'Duration' || col == 'Workers' ) {
            style = 'text-align:right;';
        }

        if (col == 'Stage') {
            style = 'padding-left: 0';
        }
        return style;
    }
</script>

<div class="project-cost">
    <DataTable
        stickyHeader table$aria-label="Construction Stages"
        class="project-stages">
        <Head>
            <Row>
            {#each columns as col}
                <Cell style={colStyle(col)}>{col}</Cell>
            {/each}
            </Row>
        </Head>
        <Body>
            {#each jobs as stage}
                <Row on:click={rowClick(stage.code)} class={stage.tasks && stage.tasks.length !== 0 ? "clickable-row" : ""}>
                    <Cell style="padding: 0; display: flex; align-items: center;">
                        <div style="width:12px;height:51px" class={stage.color}></div>
                        
                        <div style="padding-left: 8px">
                            {#if stage.tasks && stage.tasks.length !== 0}
                                <i class={'fas fa-angle-right' + ' ' + stage.code + '-icon'} aria-hidden="true"></i>
                            {/if}
                            {stage.name}
                        </div>
                    </Cell>
                    <Cell>{currency + stage.stageCost}</Cell>
                    <Cell numeric>{stage.duration} days</Cell>
                    <Cell>{stage.propertyName}</Cell>
                    <Cell>
                        {stage.propertyValue + (stage.propertyUnit === 'sq.m.' || stage.propertyUnit === '-' ? '' : stage.propertyUnit)}{#if stage.propertyUnit === 'sq.m.'}&#13217{/if}
                    </Cell>
                    <Cell numeric>{stage.workersCount}</Cell>
                    
                </Row>
                {#if stage.tasks && stage.tasks.length !== 0}
                        {#each stage.tasks as task}
                            <Row class="hidden-subtasks {stage.code}">
                                <Cell style="padding: 0; display: flex; align-items: center;">
                                    <div style="width:12px; height:51px" class={stage.color}></div>
                                    <div style="padding-left: 30px;">{task.name}</div>
                                </Cell>
                                <Cell>{currency + task.cost}</Cell>
                                <Cell numeric>{task.duration} days</Cell>
                                <Cell>{task.propertyName}</Cell>
                                <Cell>
                                    {task.propertyValue + (task.propertyUnit === 'sq.m.' || task.propertyUnit === '-' ? '' : task.propertyUnit)}{#if task.propertyUnit === 'sq.m.'}&#13217{/if}
                                </Cell>
                                <Cell numeric>{task.workersCount}</Cell>
                            </Row>
                        {/each}
                {/if}
            {/each}
        </Body>
        <LinearProgress
            style="background-color:rgb(21, 40, 89);"
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
        font-size: 16px;
        margin-left: 5px;
    }

    :global(.clickable-row) {
        cursor: pointer;
    }

    .table-caption {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    :global(.project-stages, .project-materials) {
        width: 100%;
        /* -header height -tab header height container bottom padding */
        height: calc(100vh - 64px - 76px - 20px);
        border: none;
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
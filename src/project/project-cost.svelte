<script>
    import DataTable, { Body, Head, Row, Cell} from "@smui/data-table";
    import Tooltip, { Wrapper } from '@smui/tooltip';
    import { Icon } from "@smui/common";
    import LinearProgress from '@smui/linear-progress';

    export let jobs = [];

    export let loaded = false;

    let columns = ['Color', 'Stage', 'Cost',  'Duration', 'Property Name', 'Property Value', 'Property Unit', 'People'];

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
        if (col == 'Property Value' || col == 'Cost' || col == 'Duration' || col == 'People' ) {
            style="text-align:right;";
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
                {#if col == 'Color'}
                    <Cell style="padding:0;">
                        <div style="display:flex;align-items: center;">
                        <div>
                            {col}
                        </div>
                        <Wrapper>
                            <Icon style="z-index:7" class="material-icons help-icon">help</Icon>
                            <Tooltip>Stage color in project timeline</Tooltip>
                        </Wrapper>
                        </div>
                    </Cell>
                {:else}
                    <Cell style={colStyle(col)}>{col}</Cell>
                {/if}
            {/each}
            </Row>
        </Head>
        <Body>
            {#each jobs as stage}
                <Row on:click={rowClick(stage.code)} class={stage.tasks && stage.tasks.length !== 0 ? "clickable-row" : ""}>
                    <Cell style="padding:0">
                        <div style="height:51px" class={stage.color}></div>
                    </Cell>
                    <Cell>
                        {#if stage.tasks && stage.tasks.length !== 0}
                        <i class={'fas fa-angle-right' + ' ' + stage.code + '-icon'} aria-hidden="true"></i>
                        {/if}
                        {stage.name}
                    </Cell>
                    <Cell numeric>{stage.stageCost}</Cell>
                    <Cell numeric>{stage.duration}</Cell>
                    <Cell>{stage.propertyName}</Cell>
                    <Cell numeric>{stage.propertyValue}</Cell>
                    {#if stage.propertyUnit === 'sq.m.'}
                        <Cell>&#13217;</Cell>
                    {:else}
                        <Cell>{stage.propertyUnit}</Cell>
                    {/if}
                    <Cell numeric>{stage.workersCount}</Cell>
                    
                </Row>
                {#if stage.tasks && stage.tasks.length !== 0}
                        {#each stage.tasks as task}
                            <Row class="hidden-subtasks {stage.code}">
                                <Cell style="padding:0">
                                    <div style="height:51px" class={stage.color}></div>
                                </Cell>
                                <Cell style="padding-left:30px;">{task.name}</Cell>
                                <Cell numeric>{task.cost}</Cell>
                                <Cell numeric>{task.duration}</Cell>
                                <Cell>{task.propertyName}</Cell>
                                <Cell numeric>{task.propertyValue}</Cell>
                                {#if task.propertyUnit === 'sq.m.'}
                                    <Cell>&#13217;</Cell>
                                {:else}
                                    <Cell>{task.propertyUnit}</Cell>
                                {/if}
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
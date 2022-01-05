<script>
    import DataTable, { Body, Head, Row, Cell} from "@smui/data-table";
    import LinearProgress from '@smui/linear-progress';
    import { onMount } from "svelte";
    import { responsive } from '../store';
    import { numberWithCommas } from '../utils';

    export let jobs = [];

    export let loaded = false;
    export let currency;
    let responsiveHeight = 0;

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

    onMount(() => {
        if ($responsive) {
            responsiveHeight = document.documentElement.clientHeight - 38 - 39 - 12 - 46;
        }
    })
</script>

<div class="project-cost">
    <DataTable
        stickyHeader table$aria-label="Construction Stages"
        class="project-stages"
        style={!!responsiveHeight ? "height:" + responsiveHeight + "px" : ""}>
        <Head>
            <Row>
            {#each columns as col}
                <Cell style={colStyle(col)}><div class='column-header'>{col}</div></Cell>
            {/each}
            </Row>
        </Head>
        <Body>
            {#each jobs as stage}
                <Row on:click={rowClick(stage.code)} class={stage.tasks && stage.tasks.length !== 0 ? "clickable-row" : ""}>
                    <Cell style="padding: 0;">
                        <div class={"task-container bef-bg-" + stage.color }>                        
                            <div style="padding-left: 4px;" class="break-word-style">
                                {#if stage.tasks && stage.tasks.length !== 0}
                                    <i class={'fas fa-angle-right' + ' ' + stage.code + '-icon'} aria-hidden="true"></i>
                                {/if}
                                {stage.name}
                            </div>
                        </div>
                        
                    </Cell>
                    <Cell>{currency + numberWithCommas(stage.stageCost)}</Cell>
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
                            <Cell style="padding: 0;">
                                <div class={"task-container bef-bg-" + stage.color }>
                                    <div style="padding-left: 16px;" class="break-word-style">{task.name}</div>
                                </div>
                            </Cell>
                            <Cell>{currency + numberWithCommas(task.cost)}</Cell>
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
            style="background-color:#2D62E8;"
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

    :global(.task-container) {
        display: flex;
        align-items: center;
        height: fit-content;
    }
    :global(.task-container::before) {
        width: 12px;
        content: '';
        height: 140px;
        margin: -100px 0;
    }

    @media (max-width: 839px) {
        :global(.task-container) {
            overflow-wrap: break-word;
            width: 132px;
            /* height: 80px; */
        }

        :global(.task-container::before) {
            width: 15px;
        }

        :global(.break-word-style) {
            padding-left: 30px;
            inline-size: 110px;
            overflow-wrap: break-word;
            word-break: break-word;
            height:auto;
            white-space: pre-line;
            hyphens: auto;
        }

        :global(.project-stages, .project-materials)
        {
            height: calc(100vh - 38px - 39px - 12px - 46px);
        }

        :global(.project-stages th:first-of-type:before) {
            padding: 12px;
            background-color: chartreuse;
        }

        :global(
            .project-stages th:first-of-type, .project-materials th:first-of-type,
            .project-stages td:first-of-type, .project-materials td:first-of-type)
        {
            position: sticky;
            position: -webkit-sticky;
            left: 0;
            z-index: 1102;
            background-color:white;
            box-shadow: 3px 1px 3px rgba(0, 0, 0, 0.06), 2px 1px 2px rgba(0, 0, 0, 0.06), 1px 0px 1px rgba(0, 0, 0, 0.06);
        }

        :global(.project-stages th:first-of-type, .project-materials th:first-of-type) {
            padding-left: 16px !important;
        }

        :global(.project-stages td:first-of-type, .project-materials td:first-of-type)
        {
            z-index: 1101;
        }

        :global(.project-stages .column-header, .project-materials .column-header) {
            line-height: 36px;
        }

        :global(.mdc-data-table__header-row) {
            height: 36px;
        }
    }
    
    :global(.hidden-subtasks) {
        display: none;
    }
</style>
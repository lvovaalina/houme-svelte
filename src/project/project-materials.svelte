<script>
    import DataTable, { Body, Head, Row, Cell} from "@smui/data-table";
    import Tooltip, { Wrapper } from '@smui/tooltip';
    import { Icon } from "@smui/common";

    import { onMount } from "svelte";

    export let stages;
    export let projectProperties;

    let columns = ['Material', 'Cost', 'Volume', 'Nominal Cost', 'In Steps'];

    onMount(() => {
        
    });
    

    // function rowClick(className) {
    //     let rows = document.getElementsByClassName(className);
    //     rows.forEach(element => {
    //         element.classList.toggle("hidden-subtasks")
    //     });
    // }
</script>

<div class="project-cost">
    <!-- <DataTable
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
    </DataTable> -->
</div>

<style>
    :global(.costs-grid) {
        padding-top: 0;
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
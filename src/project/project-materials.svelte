<script>
    import DataTable, { Body, Head, Row, Cell} from "@smui/data-table";

    export let materials = [];
    export let currency;

    let columns = ['Material', 'Cost', 'Volume', 'Nominal Cost', 'In Steps'];
</script>

<div class="project-cost">
    <DataTable
        stickyHeader table$aria-label="Construction Materials"
        class="project-stages">
        <Head>
            <Row>
            {#each columns as col, index}
                <Cell style={index == 0 ? 'padding:0' : ''}>{col}</Cell>
            {/each}
            </Row>
        </Head>
        <Body>
            {#each materials as material}
                <Row>
                    <Cell>{material.name}</Cell>
                    <Cell>{currency + material.cost}</Cell>
                    <Cell>{material.volume + (material.propertyUnit === 'sq.m.' || material.propertyUnit === '-' ? '' : material.propertyUnit)}{#if material.propertyUnit === 'sq.m.'}&#13217{/if}</Cell>
                    <Cell>{currency + material.nominalCost + '/' + (material.propertyUnit === 'sq.m.' || material.propertyUnit === '-' ? '' : material.propertyUnit)}{#if material.propertyUnit === 'sq.m.'}&#13217{/if}</Cell>
                    <Cell>
                        <div style="width: fit-content;" class={material.color}>
                            {material.jobName}
                        </div>
                    </Cell>
                    <Cell></Cell>
                </Row>
            {/each}
        </Body>
    </DataTable>
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
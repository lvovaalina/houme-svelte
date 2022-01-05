<script>
    import DataTable, { Body, Head, Row, Cell} from "@smui/data-table";
    import { onMount } from "svelte";
    import { responsive } from '../store';
    import { numberWithCommas } from '../utils';

    export let materials = [];
    export let currency;

    let responsiveHeight = 0;

    let columns = ['Material', 'Cost', 'Volume', 'Nominal Cost', 'In stock by Date', 'In Steps'];

    onMount(() => {
        if ($responsive) {
            responsiveHeight = document.documentElement.clientHeight - 38 - 39 - 12 - 46;
        }
    })
</script>

<div class="project-cost">
    <DataTable
        stickyHeader table$aria-label="Construction Materials"
        class="project-materials"
        style={!!responsiveHeight ? "height:" + responsiveHeight + "px" : ""}>
        <Head>
            <Row>
            {#each columns as col, index}
                <Cell style={index == 0 ? 'padding:0;' : ''}>{col}</Cell>
            {/each}
            </Row>
        </Head>
        <Body>
            {#each materials as material}
                <Row>
                    <Cell style="padding: 0;">
                        <div class={"task-container bef-bg-" + material.color }>
                            <div style="padding-left: 4px;">{material.name}</div>
                        </div>
                    </Cell>
                    <Cell>{currency + numberWithCommas(material.cost)}</Cell>
                    <Cell>{material.volume + (material.propertyUnit === 'sq.m.' || material.propertyUnit === '-' ? '' : material.propertyUnit)}{#if material.propertyUnit === 'sq.m.'}&#13217{/if}</Cell>
                    <Cell>{currency + numberWithCommas(material.nominalCost) + '/' + (material.propertyUnit === 'sq.m.' || material.propertyUnit === '-' ? '' : material.propertyUnit)}{#if material.propertyUnit === 'sq.m.'}&#13217{/if}</Cell>
                    <Cell>{material.date.format('D MMM YYYY')}</Cell>
                    <Cell>
                        <div style="width: fit-content; padding: 0 5px;" class={"bg-" + material.color}>
                            {material.jobName}
                        </div>
                    </Cell>
                </Row>
            {/each}
        </Body>
    </DataTable>
</div>

<style>
    @media (max-width: 839px) {
        :global(.project-materials .task-container) {
            height: auto;
            width: auto;
        }
    }
</style>
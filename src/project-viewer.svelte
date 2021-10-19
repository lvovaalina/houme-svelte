<script lang="ts">
    import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
    import LayoutGrid, { Cell as GridCell} from '@smui/layout-grid'
    import ForgeViewer from './forge-viewer.svelte';

    export let urn;

    let projectProperties = [
        {
            name: 'Foundation volume',
            amount: 51.84,
            cost: 100,
        },
        {
            name: 'Floor area at the base',
            amount: 126,
            cost: 100,
        },
        {
            name: 'Total floor area',
            amount: 218,
            cost: 100,
        },
        {
            name: 'Walls volume',
            amount: 95,
            cost: 100,
        },
        {
            name: 'Number of walls',
            amount: 17,
            cost: 100,
        },
        {
            name: 'Roof area',
            amount: 175,
            cost: 100,
        },
        {
            name: 'Number of windows',
            amount: 3,
            cost: 100,
        },
        {
            name: 'Number of kitchens',
            amount: 1,
            cost: 100,
        },
        {
            name: 'Number of doors',
            amount: 7,
            cost: 100,
        },
        {
            name: 'Number of stairs',
            amount: 2,
            cost: 100,
        },
        {
            name: 'House perimeter',
            amount: 54,
            cost: 100,
        },
        {
            name: 'Exterior finishing area',
            amount: 270,
            cost: 100,
        },
        {
            name: 'Interior finishing area',
            amount: 300,
            cost: 100,
        },
        {
            name: 'Tile area',
            amount: 28,
            cost: 100,
        },
    ]
</script>

<h1>Project view</h1>
<!-- svelte-ignore missing-declaration -->
<LayoutGrid>
    <GridCell span={7}>
        <ForgeViewer urn={urn}></ForgeViewer>
    </GridCell>
    <GridCell span={5}>
        <h2>Project Information</h2>
        <DataTable
            class="project-properties-table"
            stickyHeader table$aria-label="House Parameters"
            style="max-width: 100%;height:400px;overflow:scroll;">
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

<style>
    h2 {
        margin-top: 0;
    }
</style>
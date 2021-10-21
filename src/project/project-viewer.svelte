<script lang="ts">
    import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
    import LayoutGrid, { Cell as GridCell} from '@smui/layout-grid'
    import ForgeViewer from './forge-viewer.svelte';

    import TabBar from '@smui/tab-bar';
    import Tab, { Label } from '@smui/tab';
    import ProjectTimeline from './project-timeline.svelte';
    import ProjectCost from './project-cost.svelte';

    export let urn;
    let active = 'Costs';

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
            propertyCode: 'BFA',
        },
        {
            name: 'Total floor area',
            amount: 218,
            cost: 100,
            propertyCode: 'FA',
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
    ];

    let stages = [
        {
            name: 'Excavation',
            cost: 600,
            time: 12,
            code: 'EXV',
            tasks: [
                {
                    name: 'Removal of the fertile layer',
                    employeesEnvolved: 2,
                    taskSpeed: 25, //sqrm in hour
                    propertyCode: 'FBA'
                },
                {
                    name: 'Axis markings',
                    employeesEnvolved: 2,
                    taskSpeed: 25,
                    propertyCode: 'FBA'
                }
            ]
        },
        {
            name: 'Foundation',
            cost: 600,
            time: 12,
            code: 'FND',
            tasks: [
                {
                    name: 'Backfilling of earth',
                    employeesEnvolved: 2,
                    taskSpeed: 25, //sqrm in hour
                    propertyCode: 'FBA'
                }
            ] 
        },
        {
            name: 'Walls',
            cost: 600,
            time: 12, 
        },
        {
            name: 'Roof',
            cost: 600,
            time: 12, 
        },
        {
            name: 'Windows and windowsills',
            cost: 600,
            time: 12, 
        },
        {
            name: 'House insulation',
            cost: 600,
            time: 12, 
        },
        {
            name: 'Floor System',
            cost: 600,
            time: 12, 
        },
        {
            name: 'Stairs',
            cost: 600,
            time: 12, 
        },
        {
            name: 'Exterior decoration of the house',
            cost: 600,
            time: 12, 
        },
        {
            name: 'Floor',
            cost: 600,
            time: 12, 
        },
        {
            name: 'Electrical wiring',
            cost: 600,
            time: 12, 
        },
        {
            name: 'Interior decoration of the house',
            cost: 600,
            time: 12, 
        },
        {
            name: 'Doors',
            cost: 600,
            time: 12, 
        },
        {
            name: 'Kitchen assembly, equipment installation',
            cost: 600,
            time: 12, 
        },
        {
            name: 'Lighting, switches',
            cost: 600,
            time: 12, 
        },
        {
            name: 'Furnishings',
            cost: 600,
            time: 12, 
        },
        {
            name: 'Commissioning works',
            cost: 600,
            time: 12, 
        },
    ];

    let project = {
        projectCost: 450000,
        projectDuration: '350 days',
        livingArea: '200 sq.m.',
        roomsNumber: 5,
        stages: stages,
        projectProperties: projectProperties,
    }
</script>

<!-- svelte-ignore missing-declaration -->
<div class="project-viewer">
    <TabBar tabs={['Project View', 'Timeline', 'Costs']} let:tab bind:active>
        <Tab {tab}>
            <Label>{tab}</Label>
        </Tab>
    </TabBar>
    
    {#if active == 'Project View'}
    <LayoutGrid>
        <GridCell span={7}>
            <ForgeViewer urn={urn}></ForgeViewer>
        </GridCell>
        <GridCell span={5}>
            <h2>Project Information</h2>
            <p>Living area: {project.livingArea}</p>
            <p>Rooms number: {project.roomsNumber}</p>
            <p>Construction cost: {project.projectCost}</p>
            <p>Construction duration: {project.projectDuration}</p>
        </GridCell>
    </LayoutGrid>
    {/if}

    {#if active == 'Timeline'}
        <ProjectTimeline stages={stages}></ProjectTimeline>
    {/if}

    {#if active == 'Costs'}
        <ProjectCost projectProperties={projectProperties} stages={stages}></ProjectCost>
    {/if}
</div>

<style>
    h2 {
        margin-top: 0;
    }
</style>
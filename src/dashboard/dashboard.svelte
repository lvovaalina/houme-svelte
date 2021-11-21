<script>
    import CircularProgress from '@smui/circular-progress';
    import DataTable, { Body, Head, Row, Cell} from "@smui/data-table";
    import { onMount } from 'svelte';

    let loaded = true;
    let columns = [
        {name: 'Image'},
        {name: 'Title'},
        {name: 'Duration'},
        {name: 'Area'},
        {name: 'Margin'},
        {name: 'Build cost'},
        {name: 'Material cost'},
        {name: 'People'},
    ]

    export let projects = [];

    let dataLoaded = false;

    import { config } from '../config';
    let conf = new config();

    onMount(function() {
        fetch(conf.api + '/getProjects')
        .then((result) => {
            if (result.ok) {
                console.log("get projects successfully");
            }

            return result.json();
        })
        .then((resp) => {
            resp.data.forEach(element => {
                element.PropertyValue = null;
            });

            projects = resp.data;
            dataLoaded = true;
        });
    });


</script>

<div class="dashboard">
    {#if dataLoaded}

    <DataTable
        stickyHeader table$aria-label="Project dashboard"
        class="projects-table">
        <Head>
            <Row>
            {#each columns as col}
                    <Cell>{col.name}</Cell>
            {/each}
            </Row>
        </Head>
        <Body>
            {#each projects as project}
                <Row>
                    <Cell>
                        <img class="project-image" src="/project.png" alt="Project mini version"/>
                    </Cell>
                    <Cell>
                        {project.Name}
                    </Cell>
                    <Cell>{project.ConstructionDuration} days</Cell>
                    <Cell>{project.LivingArea} &#13217;</Cell>
                    <Cell>{project.ConstructionCost * 0.15} $</Cell>
                    <Cell>{project.ConstructionCost} $</Cell>
                    <Cell>{project.ConstructionCost} $</Cell>
                    <Cell>50 p.</Cell>
                </Row>
            {/each}
        </Body>
        <!-- <LinearProgress
            indeterminate
            bind:closed={loaded}
            aria-label="Data is being loaded..."
            slot="progress"
        /> -->
    </DataTable>
    {:else}
        <div style="display: flex; justify-content: center">
            <CircularProgress style="height: 90vh; width: 120px;" indeterminate />
        </div>
    {/if}
</div>

<style>
    :global(.projects-table) {
        border: none;
        width: 100%;
    }
    .project-image {
        height: 50px;
        width: 100px;
        margin-top: 5px;
    }

    .dashboard {
        padding: 0 90px;
    }
</style>

<script>
    import CircularProgress from '@smui/circular-progress';
    import DataTable, { Body, Head, Row, Cell} from "@smui/data-table";
    import { onMount } from 'svelte';

    import { Input } from '@smui/textfield';
    import Paper from '@smui/paper';
    import { Icon } from '@smui/common';

    let loaded = true;
    let titleSearch;
    let columns = [
        {name: 'Image', style: 'padding-left: 0'},
        {name: 'Title'},
        {name: 'Duration'},
        {name: 'Area'},
        {name: 'Margin', style:'text-align: right;'},
        {name: 'Build cost', style:'text-align: right;'},
        {name: 'Material cost', style:'text-align: right;'},
        {name: 'People', style:'text-align: right;'},
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

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            doSearch();
        }
    }

    function doSearch() {
        console.log(titleSearch);
    }

    function navigateToProject(projectId) {
        window.open(window.location.origin + '/view/' + projectId, '_blank');
    }

</script>

<div class="dashboard">
    {#if dataLoaded}
    <div class="project-table-header">
        <span class="results-found-text">15 projects found</span>
        <div class="solo-demo-container solo-container">
            <Paper class="solo-paper" elevation={6}>
              <Icon class="material-icons">search</Icon>
              <Input
                bind:titleSearch
                on:keydown={handleKeyDown}
                placeholder="Search by Title"
                class="solo-input"
              />
            </Paper>
          </div>
    </div>
    <DataTable
        stickyHeader table$aria-label="Project dashboard"
        class="projects-table">
        <Head>
            <Row>
            {#each columns as col}
                <Cell style={col.style}>{col.name}</Cell>
            {/each}
            </Row>
        </Head>
        <Body>
            {#each projects as project}
                <Row style="cursor: pointer" on:click={navigateToProject(project.ProjectId)}>
                    <Cell style="padding-left:0;">
                        <img class="project-image" src="/project.png" alt="Project mini version"/>
                    </Cell>
                    <Cell>
                        {project.Name}
                    </Cell>
                    <Cell>{project.ConstructionDuration} days</Cell>
                    <Cell>{project.LivingArea} &#13217;</Cell>
                    <Cell numeric>{project.ConstructionCost * 0.15} $</Cell>
                    <Cell numeric>{project.ConstructionCost} $</Cell>
                    <Cell numeric>{project.ConstructionCost} $</Cell>
                    <Cell numeric>50 p.</Cell>
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
    .solo-container {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 15px 0;
        width: 50%;
    }

    * :global(.solo-paper) {
        display: flex;
        align-items: center;
        flex-grow: 1;
        max-width: 600px;
        height: 48px;
        box-shadow: none;
        border: 1px solid #e0e1e2;
    }
    * :global(.solo-paper > *) {
        display: inline-block;
        margin: 0 12px;
    }
    * :global(.solo-input) {
        flex-grow: 1;
        color: var(--mdc-theme-on-surface, #000);
    }
    * :global(.solo-input::placeholder) {
        color: var(--mdc-theme-on-surface, #000);
        opacity: 0.6;
    }

    .project-table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

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
        padding: 0 100px;
    }
</style>

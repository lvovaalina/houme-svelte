<script>
    import CircularProgress from '@smui/circular-progress';
    import DataTable, {
        Head,
        Body,
        Row,
        Cell,
        Label,
    } from '@smui/data-table';
    import LinearProgress from '@smui/linear-progress';
    import Tooltip, { Wrapper } from '@smui/tooltip';
    import Button, { Label as ButtonLabel } from '@smui/button';

    import ForgeViewer from '../project/forge-viewer.svelte';

    import { onMount } from 'svelte';
    import { navigate } from 'svelte-navigator';
    import { pageTitle } from '../store';

    import { Input } from '@smui/textfield';
    import Paper from '@smui/paper';
    import { Icon } from '@smui/common';

    import IconButton from '@smui/icon-button';

    let loaded = true;
    let titleSearch;
    let columns = [
        {name: 'Image', style: 'padding-left: 0'},
        {name: 'Title', columnId: 'Name'},
        {name: 'Duration', columnId: 'ConstructionDuration'},
        {name: 'Area', columnId: 'LivingArea'},
        {name: 'Margin', style:'text-align: right;'},
        {name: 'Build cost', style:'text-align: right;'},
        {name: 'Material cost', style:'text-align: right;'},
        {name: 'People', style:'text-align: right;'},
        {name: ''},
    ];

    export let projects = [];
    let projectsResult = [];
    let projectsCount;

    let dataLoaded = false;
    let dataLoadedForSearch = false;

    import { config } from '../config';
    let conf = new config();

    let sort = 'title';
    let sortDirection = 'ascending'; //ascending descending 

    let selectedProjectId = 0;

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
            projectsResult = projects;
            projectsCount = projects.length;
            dataLoaded = true;
            dataLoadedForSearch = true;
        });

        pageTitle.set({
            title: 'Project Dashboard',
            projectName: ''
        });
    });

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            dataLoadedForSearch = false;
            selectedProjectId = 0;
            doSearch();
        }
    }

    function doSearch() {
        var re = new RegExp(titleSearch+'.+$', 'i');
        projectsResult = projects.filter(function(project, i, a){
            return project.Name.search(re) != -1;
        });
        projectsCount = projectsResult.length;
        dataLoadedForSearch = true;
    }

    function navigateToProject(event, projectId) {
        navigate('/view/' + projectId + '/model', {replace: true});
    }

    function handleSort(event) {
        console.log(event);
        console.log("SORT", sort);
        projectsResult.sort((a, b) => {
            const [aVal, bVal] = [a[sort], b[sort]][
                sortDirection === 'ascending' ? 'slice' : 'reverse'
            ]();
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return aVal.localeCompare(bVal);
            }
            return Number(aVal) - Number(bVal);
        });
        projectsResult = projectsResult;
    }

</script>

<div class="dashboard">
    {#if dataLoaded}
    <div class="project-table-header">
        <h1>Projects({projectsCount})</h1>
        <div class="solo-demo-container solo-container">
            <Paper class="solo-paper" elevation={6}>
                <Icon class="material-icons">search</Icon>
                <Wrapper>
                    <Input
                        bind:value={titleSearch}
                        on:keydown={handleKeyDown}
                        placeholder="Search by Title"
                        class="solo-input"
                    />
                    <Tooltip>Press Enter to Search</Tooltip>
                </Wrapper>
                
            </Paper>
        </div>
    </div>
    <div class="dasboard-content-container">
    <div class="projects-table-container">
        <DataTable
            sortable
            bind:sort
            bind:sortDirection
            on:MDCDataTable:sorted={handleSort}
            stickyHeader table$aria-label="Project dashboard"
            class="projects-table">
            <Head>
                <Row>
                {#each columns as col}
                    <Cell sortable={!!col.columnId ? 'true' : 'false'} style={col.style} columnId={col.columnId}>
                        <Label>{col.name}</Label>
                        {#if !!col.columnId}
                            <IconButton style="margin-bottom: 0; font-size: 16px;" class="material-icons">arrow_upward</IconButton>
                        {/if}
                    </Cell>
                {/each}
                </Row>
            </Head>
            <Body>
                {#if projectsResult.length !== 0} 
                {#each projectsResult as project}
                    <Row style="cursor: pointer" on:click={() => selectedProjectId = project.ProjectId}>
                        <Cell style="padding-left:0;">
                            <img class="project-image" src="/project.png" alt="Project mini version"/>
                        </Cell>
                        <Cell>
                            {project.Name}
                        </Cell>
                        <Cell>{project.ConstructionDuration} days</Cell>
                        <Cell>{project.LivingArea} &#13217;</Cell>
                        <Cell numeric>{parseInt(project.ConstructionCost * 0.15)} $</Cell>
                        <Cell numeric>{project.ConstructionCost} $</Cell>
                        <Cell numeric>{project.ConstructionCost} $</Cell>
                        <Cell numeric>50 p.</Cell>
                        <Cell><Button variant="outlined" on:click={(event) => navigateToProject(event, project.ProjectId)}>
                            <ButtonLabel>DETAILS</ButtonLabel>
                        </Button></Cell>
                    </Row>
            {/each}
            {/if}
            </Body>
            <LinearProgress
                bind:closed={dataLoadedForSearch}
                indeterminate
                aria-label="Data is being loaded..."
                slot="progress"
            />
        </DataTable>

        {#if projectsResult.length === 0}
        <p style="text-align:center">No projects to view</p>
        {/if}
    </div>
    <div class="forge-container">
        {#if !!selectedProjectId && selectedProjectId > 0}
            <p style="margin-bottom: -20px;">PROJECT</p>
            <h2>{projects.find(x => x.ProjectId == selectedProjectId).Name}</h2>
            <ForgeViewer forgeViewerClass="dashboard-height"></ForgeViewer>
        {:else}
        <p style="text-align: center;">Select a project for a quick view</p>
        {/if}
    </div>
    </div>

    {:else}
        <div style="display: flex; justify-content: center">
            <CircularProgress style="height: 90vh; width: 120px;" indeterminate />
        </div>
    {/if}
</div>

<style>
    .dasboard-content-container {
        display: flex;
    }

    .projects-table-container {
        border-right: 1px solid #d3d3d1;
        height: calc(100vh - 80px - 76px - 20px);
    }

    .forge-container {
        width: 40%;
        padding: 0 30px;
    }
    .solo-container {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 15px 0;
        margin-left: 15px;
        width: 50%;
    }

    * :global(.solo-paper) {
        display: flex;
        align-items: center;
        flex-grow: 1;
        max-width: 600px;
        height: 40px;
        padding: 20px 16px;
        box-shadow: none;
        border: 1px solid #e0e1e2;
    }
    * :global(.solo-paper > *) {
        display: inline-block;
    }
    * :global(.solo-input) {
        flex-grow: 1;
        color: var(--mdc-theme-on-surface, #000);
        margin: 0 10px;
    }
    * :global(.solo-input::placeholder) {
        color: var(--mdc-theme-on-surface, #000);
        opacity: 0.6;
    }

    .project-table-header {
        display: flex;
        align-items: center;
        width: 50%;
    }

    :global(.projects-table) {
        border: none;
        width: 50%;
    }
    .project-image {
        height: 50px;
        width: 100px;
        margin-top: 5px;
    }

    .dashboard {
        padding: 0 25px;
    }
</style>

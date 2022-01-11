<script>
    import CircularProgress from '@smui/circular-progress';
    import DataTable, {
        Head,
        Body,
        Row,
        Cell,
        Label,
    } from '@smui/data-table';
    import Ripple from '@smui/ripple';
    import LinearProgress from '@smui/linear-progress';
    import Tooltip, { Wrapper } from '@smui/tooltip';
    import { watchResize } from "svelte-watch-resize";

    import ForgeViewer from '../project/forge-viewer.svelte';

    import { onMount } from 'svelte';
    import { Link } from 'svelte-navigator';
    import { pageTitle } from '../store';
    import { numberWithCommas } from '../utils';

    import { Input } from '@smui/textfield';
    import Paper from '@smui/paper';
    import { Icon } from '@smui/common';

    import IconButton from '@smui/icon-button';
    let urn;

    let currency = '$';
    let detailsUrl = '';

    let titleSearch;
    let columns = [
        {name: ''},
        {name: 'Image', class: 'image-column'},
        {name: 'Title', columnId: 'Name'},
        {name: 'Duration', columnId: 'ConstructionDuration'},
        {name: 'Area', columnId: 'LivingArea'},
        {name: 'Margin' },
        {name: 'Project Cost' },
        {name: 'Job Cost' },
        {name: 'Material Cost' },
        {name: 'Workers' },
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
        setDetailsUrlPart();

        fetch(conf.api + '/getProjects')
        .then((result) => {
            if (result.ok) {
                console.log("get projects successfully");
            }

            return result.json();
        })
        .then((resp) => {
            resp.data.forEach(element => {
                element.LivingArea = parseInt(element.LivingArea);
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
        let searchTerm = titleSearch.toLowerCase().trim();
        projectsResult = projects.filter(function(project){
            return project.Name.toLowerCase().startsWith(searchTerm);
        });
        projectsCount = projectsResult.length;
        dataLoadedForSearch = true;
    }

    function handleSort(event) {
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

    function getWidth() {
        return Math.max(
            document.body.scrollWidth,
            document.documentElement.scrollWidth,
            document.body.offsetWidth,
            document.documentElement.offsetWidth,
            document.documentElement.clientWidth
        );
    }

    function showProjectModel(id) {
        selectedProjectId = id;
        urn = projects.find(x => x.ProjectId == selectedProjectId).Filename;
    }

    function setDetailsUrlPart(){
        if (getWidth() > 839) {
            detailsUrl = '/model';
        } else {
            detailsUrl = '/details';
        }
    }

    function handleResize() {
        setDetailsUrlPart();
    }
</script>

<div class="dashboard" use:watchResize={handleResize}>
    {#if dataLoaded}
    <div class="project-table-header">
        <h1>Projects</h1> <!-- ({projectsCount})</h1> -->
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
                {#each columns as col, index}
                    {#if index == 0}
                        <Cell style="padding-left: 5px;padding-right: 0;"></Cell>
                    {:else}
                    <Cell sortable={!!col.columnId ? 'true' : 'false'} class={col.class} columnId={col.columnId}>
                        <Label>{col.name}</Label>
                        {#if !!col.columnId}
                            <IconButton style="margin-bottom: 0; font-size: 16px;" class="material-icons">arrow_upward</IconButton>
                        {/if}
                    </Cell>
                    {/if}
                {/each}
                </Row>
            </Head>
            <Body>
                {#if projectsResult.length !== 0} 
                {#each projectsResult as project, index}
                    <Row style="cursor: pointer" on:click={showProjectModel(project.ProjectId)}>
                        <Cell style="padding-left: 5px;padding-right: 0;">{index + 1}</Cell>
                        <Cell style="padding-left:0;" class="image-column-row">
                            <div class="project-cover-container">
                            <Link to="/view/{project.ProjectId}/{detailsUrl}">
                                <img
                                    class="project-image"
                                    src="{'data:image/png;base64,' + project.ProjectCover}"
                                    alt="Project {project.Name} cover"/>
                            </Link>
                            </div>
                        </Cell>
                        <Cell style="height:fit-content">
                            <div class="break-word-style" style="white-space: pre-line;">
                                {project.Name}
                            </div>
                        </Cell>
                        <Cell>
                            <div class="days-after">
                                {project.ConstructionDuration}
                            </div>
                        </Cell>
                        <Cell>{project.LivingArea} &#13217;</Cell>
                        <Cell>{currency + numberWithCommas(project.Margin)}</Cell>
                        <Cell>{currency + numberWithCommas(project.ConstructionCost)}</Cell>
                        <Cell>{currency + numberWithCommas(project.ConstructionJobCost)}</Cell>
                        <Cell>{currency + numberWithCommas(project.ConstructionMaterialCost)}</Cell>
                        <Cell>{project.Workers}</Cell>
                        <Cell>
                            <div use:Ripple={{ surface: true }} class="project-link-container">
                                <Link style="color: #2D62E8" to="/view/{project.ProjectId}/{detailsUrl}">DETAILS</Link>
                            </div>
                        </Cell>
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
    <div class="projects-grid-responsive">
        {#if projectsResult.length === 0}
            <p style="text-align:center">No projects to view</p>
        {/if}
        {#each projectsResult as project}
        <div class="details-padding"></div>
        <div class="project-drid-responsive">
            <div class="project-grid-header">
                <div class="project-cover-container">
                    <Link to="/view/{project.ProjectId}/{detailsUrl}">
                        <img
                            class="project-image"
                            src="{'data:image/png;base64,' + project.ProjectCover}"
                            alt="Project {project.Name} cover"/>
                    </Link>
                </div>
                <div class="project-grid-header-name">{project.Name}</div>
            </div>
            <div class="property-grid-responsive">
                <div class="property-details-grid-cell">
                    <div class="property-name">Duration</div>
                    <div class="property-value">{project.ConstructionDuration} days</div>
                </div>
                <div class="property-details-grid-cell">
                    <div class="property-name">Area</div>
                    <div class="property-value">{project.LivingArea}&#13217;</div>
                </div>
                <div class="property-details-grid-cell">
                    <div class="property-name">Margin</div>
                    <div class="property-value">{currency + numberWithCommas(project.Margin)}</div>
                </div>
                <div class="property-details-grid-cell">
                    <div class="property-name">Workers</div>
                    <div class="property-value">{project.Workers}</div>
                </div>
                <div class="property-details-grid-cell">
                    <div class="property-name">Project Cost</div>
                    <div class="property-value">{currency + numberWithCommas(project.ConstructionCost)}</div>
                </div>
                <div class="property-details-grid-cell">
                    <div class="property-name">Job Cost</div>
                    <div class="property-value">{currency + numberWithCommas(project.ConstructionJobCost)}</div>
                </div>
                <div class="property-details-grid-cell">
                    <div class="property-name">Material Cost</div>
                    <div class="property-value">{currency + numberWithCommas(project.ConstructionMaterialCost)}</div>
                </div>
                <div class="property-details-grid-cell">
                    <div use:Ripple={{ surface: true }} class="project-link-container">
                        <Link style="color:white" to="/view/{project.ProjectId}/{detailsUrl}">DETAILS</Link>
                    </div>
                </div>
            </div>
        </div>
        {/each}
    </div>
    <div class="forge-container">
        {#if !!selectedProjectId && selectedProjectId > 0}
            <p style="margin-bottom: -20px;">PROJECT</p>
            <h2>{projects.find(x => x.ProjectId == selectedProjectId).Name}</h2>
            <ForgeViewer urn={urn} forgeViewerClass="dashboard-height"></ForgeViewer>
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
    :global(.days-after::after) {
        content: ' days';
    }

    :global(.image-column) {
        padding-left: 0;
    }

    .project-link-container {
        color: #2D62E8;
        height: 36px;
        border: 1px solid #2D62E8;
        border-radius: 4px;
    }

    :global(.project-link-container a) {
        font-weight: 500;
        display: flex;
        align-items: center;
        padding: 0 15px;
        height: 100%;
    }

    :global(.project-cover-container) {
        width: 100px;
        height: 55px;
    }

    .dasboard-content-container {
        display: flex;
    }

    .projects-table-container {
        border-right: 1px solid #d3d3d1;
        height: calc(100vh - 64px - 76px);
    }

    .forge-container {
        width: 40%;
        padding: 0 0 0 30px;
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

    .projects-grid-responsive {
        display: none;
    }

    :global(.mdc-data-table__sort-icon-button) {
        opacity: 1;
    }

    @media only screen and (max-width:1499px) {
        :global(.mdc-data-table__header-cell, .mdc-data-table__cell) {
            padding: 0 10px;
        }
    }

    @media only screen and (max-width:1289px)
    {
        :global(.image-column-row, .image-column) {
            display: none;
        }

        :global(.days-after::after) {
            content: 'd';
        }

        .project-link-container {
            height: 25px;
        }

        :global(.project-link-container a) {
            padding: 0 5px;
            font-size: 12px;
        }
    }

    @media only screen and (max-width:1089px) {
        :global(.mdc-data-table__header-cell, .mdc-data-table__cell) {
            padding: 0 7px;
        }

        :global(.mdc-data-table__sort-icon-button) {
            width: 10px !important;
            margin-right: 0 !important;
        }
    }

    @media only screen and (max-width:989px) {
        :global(.image-column-row, .image-column) {
            display: table-cell;
        }

        .forge-container {
            display: none;
        }

        .projects-table-container {
            border: none;
        }

        :global(.mdc-data-table__header-cell, .mdc-data-table__cell) {
            padding: 0 8px;
        }
    }

    @media only screen and (max-width:839px)
    {
        .property-name {
            font-size: 10px;
        }

        .property-value {
            font-size: 14px;
        }

        .project-drid-responsive {
            padding: 0 12px;
            box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.06), 0px 1px 1px rgba(0, 0, 0, 0.06);
        }
        .project-cover-container {
            width: 25%;
        }

        .project-grid-header-name {
            font-size: 18px;
            font-weight: 500;
            margin-left: 25px;
        }

        .project-grid-header {
            display: flex;
            align-items: center;
        }

        .project-link-container {
            background-color: #2D62E8;
            display: flex;
            justify-content: center;
        }

        .details-padding {
            background-color: #F5F7FA;
            opacity: 70%;
            height: 12px;
            width: 100vw;
        }

        .projects-grid-responsive {
            display: block;
        }

        .property-details-grid-cell {
            width: 25%;
            margin: 8px 0;
        }

        .property-grid-responsive {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
        }

        .dashboard {
            padding: 0;
        }

        .project-table-header {
            width: 100%;
            justify-content: space-between;
            padding: 0 12px;
            box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.06), 0px 1px 1px rgba(0, 0, 0, 0.06);
        }

        .project-table-header h1 {
            margin: 0;
            font-size: 21px;
        }

        .project-table-header .solo-container {
            width: auto;
        }

        .forge-container {
            display: none;
        }

        .projects-table-container {
            display: none;
        }

        :global(.project-link-container a) {
            font-size: 14px;
        }

        .solo-demo-container {
            padding: 5px 0;
        }
    }
</style>

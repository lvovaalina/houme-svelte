<script>
    import AddManageProjectDialog from '../common/add-manage-project-dialog.svelte';
    import DeleteProjectDialog from '../common/delete-project-dialog.svelte';
    import SvelteGenericCrudTable from 'svelte-generic-crud-table';
    import LinearProgress from '@smui/linear-progress';
    import { onMount } from 'svelte';

    import { getNotificationsContext } from 'svelte-notifications';
    const { addNotification } = getNotificationsContext();

    let loaded = true;

    const api = isProduction
        ? "https://houme-api.herokuapp.com"
        : "http://localhost:10000";

    function reloadonPropertyChange(reloadProj) {
        // DIRTY SOLUTION
        //todo: reload projects once all goroutines are done
        loaded = false;
        setTimeout(() => {
            reload();
            loaded = true;
        }, 3000);
    }

    export let reloadProj = false;
    $: r = reloadonPropertyChange(reloadProj);

    let openAddProjectDialog = false;
    let openDeleteProjectDialog = false;
    let update = false;

    let projectIdToDelete = 0;

    let projects = [];
    let projectToUpdate = {};

    const sortStore = [];

    function reload() {
        fetch(api + '/getProjects')
        .then((result) => {
            if (result.ok) {
                console.log("get projects successfully");
            }

            return result.json();
        })
        .then((resp) => {
            projects = resp.data;
        });
    }

    onMount(() => {
        reload();
    });

    function handleSort(event) {
        const column = event.detail.column;
        if (sortStore[column] === undefined || sortStore[column] === 'DESC') {
            sortStore[column] = 'ASC';
        } else {
            sortStore[column] = 'DESC';
        }

        const tableSort = (a, b) => {
            var keyA = a[column];
            var keyB = b[column];
            if (sortStore[column] === 'ASC') {
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
            } else {
                if (keyA < keyB) return 1;
                if (keyA > keyB) return -1;
            }
            return 0;
        };

        projects = projects.sort(tableSort);
    }

    function handleUpdate(event) {
        let properties = [];
        let getProperties = fetch(api + '/getProperties')
        .then((result) => {
            if (result.ok) {
                console.log("get successfully");
            }

            return result.json();
        })
        .then((resp) => {
            resp.data.forEach(element => {
                element.PropertyValue = null;
            });

            properties = resp.data;
        });

        let getProject = () =>{
            fetch(api + '/getProject/' + event.detail.body.ProjectId)
            .then((result) => {
                if (result.ok) {
                    console.log("get project success");
                }

                return result.json();
            })
            .then((resp) => {
                let proj = resp.data;

                proj.ProjectJobs.sort((el1, el2) => el1.Job.JobId - el2.Job.JobId);

                properties.forEach((prop) => {
                    let props = proj.ProjectProperties.filter(p => p.Property.PropertyCode == prop.PropertyCode);
                    
                    if (props.length !== 0) {
                        prop.PropertyValue = props[0].PropertyValue;
                    }
                });

                
                proj.ProjectProperties = properties;

                projectToUpdate = proj;
                update = true;
                openAddProjectDialog = true;
            });

        } 
        getProperties.then(() => getProject());
    }

    function handleDelete(event) {
        projectIdToDelete = event.detail.body.ProjectId;
        openDeleteProjectDialog = true;
    }

    function handleDetail(event) {

        window.open(window.location.origin + '/view/' + event.detail.body.ProjectId, '_blank');
    }

    function addProject() {
        //reload data table
        addNotification({
            text: 'Project added!',
            position: 'top-center',
        });
        reload();
    }

    function updateProject(event) {
        projectToUpdate = {};
        addNotification({
            text: 'Project ' + event.detail.projectId + ' updated!',
            position: 'top-center',
        });
        update = false;
        reload();
    }

    function onDelete() {
        reload();
        addNotification({
            text: 'Project ' + projectIdToDelete + ' deleted!',
            position: 'top-center',
        });
        projectIdToDelete = 0;
    }


    const table_config = {
        name: 'Construction Cost',
        options: ['EDIT', 'CREATE', 'DELETE', 'DETAILS'],
        columns_setting: [
            {name: 'ProjectId', show: true, edit: false, width: '50px'},
            {name: 'Name', show: true, edit: false, width: '150px', tooltip: true},
            {name: 'ConstructionCost', show: true, edit: false, width: '150px'},
            {name: 'ConstructionDuration', show: true, edit: false, width: '150px'},
        ],
        details_text: 'detail'   // replace the standard icon with an text-link
    }

    function handleAdd() {
        openAddProjectDialog = true;
    }

</script>


<div class="projects">
    <h2>Projects</h2>

    <LinearProgress
        indeterminate
        bind:closed={loaded}
        aria-label="Data is being loaded..."
        slot="progress"
    />

    <SvelteGenericCrudTable
        on:create={handleAdd}
        on:update={handleUpdate}
        on:sort={handleSort}
        on:delete={handleDelete}
        on:details={handleDetail}
        table_config={table_config}
        table_data={projects}>
    </SvelteGenericCrudTable>

    <AddManageProjectDialog
        bind:open={openAddProjectDialog}
        on:add={addProject}
        on:update={updateProject}
        newProject={!update}
        project={projectToUpdate}
        fullAccess={true}></AddManageProjectDialog>

    <DeleteProjectDialog
        projectId={projectIdToDelete}
        bind:open={openDeleteProjectDialog}
        on:delete={onDelete}></DeleteProjectDialog>
</div>

<style>
    :global(.projects .table) {
        height: auto;
        overflow: scroll;
    }
</style>



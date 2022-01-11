<script>
    import AddManageProjectDialog from '../common/add-manage-project-dialog.svelte';
    import DeleteProjectDialog from '../common/delete-project-dialog.svelte';
    import SvelteGenericCrudTable from 'svelte-generic-crud-table';
    import LinearProgress from '@smui/linear-progress';
    import { onMount } from 'svelte';

    import { getNotificationsContext } from 'svelte-notifications';
    const { addNotification } = getNotificationsContext();

    let loaded = true;

    let selectedProjectId;
    let selectedProjectJobs = [];

    import { config } from '../config';
    let conf = new config();
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
        fetch(conf.api + '/getProjects')
        .then((result) => {
            if (result.ok) {
                console.log("get projects successfully");
            }

            return result.json();
        })
        .then((resp) => {
            resp.data.forEach(element => {
                element.Link = '<a target="blank" href="'+window.location.origin + '/view/' + element.ProjectId +'">'+ element.Name +' Link</a>'
            });
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
        let getProperties = fetch(conf.api + '/getProperties')
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
            fetch(conf.api + '/getProject/' + event.detail.body.ProjectId)
            .then((result) => {
                if (result.ok) {
                    console.log("get project success");
                }

                return result.json();
            })
            .then((resp) => {
                let proj = resp.data;

                proj.ProjectCoverBase64 = 'data:image/png;base64,' + proj.ProjectCover;

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
        selectedProjectJobs = [];

        selectedProjectId = event.detail.body.ProjectId;

        fetch(conf.api + '/auth/getProjectJobs/'+ selectedProjectId, {credentials: 'include',})
        .then((result) => {
            if (result.ok) {
                console.log("get projects successfully");
            }

            return result.json();
        })
        .then((resp) => {
            resp.data.ProjectJobs.forEach(element => {
                element.StageName = element.Job.StageName;
                element.SubStageName = element.Job.SubStageName;
                element.JobName = element.Job.JobName;
                element.JobDurationInDays = element.ConstructionDurationInDays;
                element.JobDurationInHours = element.ConstructionDurationInHours;
                element.JobCost = element.ConstructionCost;
                element.JobWorkers = element.ConstructionWorkers;
                let jobProps = resp.data.ProjectJobValues.find(x => x.JobCode == element.Job.JobCode);
                element.JobWorkVolume = jobProps.JobValue;
                element.JobSpeedUnitInHour = jobProps.JobSpeed;
            })
            selectedProjectJobs = resp.data.ProjectJobs;
        });
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
            {name: 'Link', show: true, type: 'html', edit: false, width: '150px'},
        ],
        details_text: 'detail'
    }

    const project_job_table_config = {
        name: 'Project jobs',
        options: [],
        columns_setting: [
            {name: 'ProjectRefer', show: true, width: '50px'},
            {name: 'ProjectJobId', show: true, width: '100px', tooltip: true},
            {name: 'JobId', show: true, edit: false, width: '50px'},
            {name: 'StageName', show: true, width: '150px', tooltip: true},
            {name: 'SubStageName',show: true, width: '150px', tooltip: true},
            {name: 'JobName',show: true, width: '150px', tooltip: true},
            {name: 'JobDurationInDays', show: true, edit: false, width: '150px'},
            {name: 'JobDurationInHours', show: true, edit: false, width: '150px', tooltip: true},
            {name: 'JobWorkVolume', show: true, edit:false, width: '150px'},
            {name: 'JobSpeedUnitInHour', show: true, edit: false, width: '150px'},
            {name: 'JobWorkers', show: true, edit: false, width: '30px'},
            {name: 'JobCost', show: true, edit:false, width: '150px'},
        ],
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

    <div class="project-jobs-table">
    <SvelteGenericCrudTable
        table_config={project_job_table_config}
        table_data={selectedProjectJobs}>
    </SvelteGenericCrudTable>
    </div>

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

    :global(.project-jobs-table .table) {
        margin-top: 20px;
    }
</style>



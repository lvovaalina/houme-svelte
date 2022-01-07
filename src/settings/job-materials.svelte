<script>
    import SvelteGenericCrudTable from 'svelte-generic-crud-table';
    import { onMount } from 'svelte';
    import { getNotificationsContext } from 'svelte-notifications';
    import Select, { Option } from '@smui/select';
    import Textfield from '@smui/textfield';
    import Button, { Label } from '@smui/button';

    const { addNotification } = getNotificationsContext();

    const sortStore = [];

    let create = false;

    let myData = [];

    let jobMaterials = [];

    let jobs = [];

    let jobStageMap = new Map();
    let stageNames = [];
    let jobsViewModel = [];

    let material = {
        stageNameValue: '',
        jobNameValue: '',
        peoprtyName: '',
        materialName: '',
        materialCost: ''
    }

    let jobName = '';
    let stageName = '';

    function updateJobName(jobName) {
        if (!!material.jobNameValue) {
            material.jobNameValue = '';
        }

        jobName = '';
    }

    $: jobName = updateJobName(stageName);

    // workaround for emptying job name on stage name change
    // since changing object triggers all property bindings to fire
    $: material.jobNameValue = jobName;
    $: material.stageNameValue = stageName;

    import { config } from '../config';
    let conf = new config();
    onMount(() => {
        reload();
        get('/getJobs')
            .then(resp => {
                jobs = resp.data;

                stageNames = [...new Set(jobs.map(x => x.StageName))];
                jobsViewModel = jobs
                    .filter(j => j.Property.ID !== 0)
                    .map(x =>({
                        JobName: x.JobName,
                        StageName: x.StageName,
                        PropertyUnit: x.Property.PropertyUnit}));

                stageNames.forEach(stage => {
                    jobStageMap[stage] = jobsViewModel.filter(x => x.StageName == stage);
                });
            });
    });

    function handleCreate(event) {
        create = true;
    }

    function get(url) {
        return fetch(conf.api + url, { credentials: 'include',})
        .then((result) => {
            if (result.ok) {
                console.log("get job properties success");
            }

            return result.json();
        })
    }

    function reload() {
        get('/auth/getJobMaterials').then((resp) => {
            jobMaterials = resp.data;
            resp.data.forEach(element => {
                element.StageName = element.Job.StageName;
                element.SubStageName = element.Job.SubStageName;
                element.JobName = element.Job.JobName;
                element.Unit = !!element.Job.Property && element.Job.Property.ID > 0
                    ? '$/' + element.Job.Property.PropertyUnit
                    : '';
                element.PropertyName = element.Job.Property.PropertyName;
            });
            myData = resp.data;

        });
    }

    function handleUpdate(event) {
        let jobMaterial = event.detail.body;
        let materialCost = parseMaterialCost(jobMaterial.MaterialCost);
        if (materialCost === -1) {
            addNotification({
                id: Date.now(),
                text: 'Material cost is invalid!',
                position: 'top-center',
                type: 'danger',
            });
            open = false;
            emptyMaterial();
            return;
        }

        let materialToUpdate = jobMaterials.find(m => m.ID == jobMaterial.ID);
        materialToUpdate.MaterialCost = materialCost;
        materialToUpdate.MaterialName = jobMaterial.MaterialName;

        fetch(conf.api + '/auth/updateJobMaterial/'+ event.detail.body.ID,
        {
            method: 'PUT',
            body: JSON.stringify(materialToUpdate),
            credentials: 'include',
        })
        .then((result) => {
            if (result.ok) {
                console.log("Updated job material successfully");
            }

            return result.json();
        })
        .then(data => {
            if (data.success) {
                reload();
            }
        })
    }

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

        myData = myData.sort(tableSort);
    }

    function emptyMaterial() {
        material = {
                stageNameValue: '',
                jobNameValue: '',
                peoprtyName: '',
                materialName: '',
                materialCost: ''
            }

            jobName = '';
            stageName = '';
    }

    function parseMaterialCost(materialCostStr) {
        let materialCost = parseFloat(materialCostStr);
        if (isNaN(materialCost)) {
            addNotification({
                id: Date.now(),
                text: 'Material cost is invalid!',
                position: 'top-center',
                type: 'danger',
            });

            return -1;
        }
        return materialCost;
    }

    function createMaterial() {
        let materialCost = parseMaterialCost(material.materialCost);
        if (materialCost === -1) {
            addNotification({
                id: Date.now(),
                text: 'Material cost is invalid!',
                position: 'top-center',
                type: 'danger',
            });
            open = false;
            emptyMaterial();
            return;
        }

        material.materialCost = materialCost;

        let job = jobs.find(x => x.JobName == material.jobNameValue);
        material.Job = {JobCode: job.JobCode};

        fetch(conf.api + '/auth/createMaterial',
        {
            method: 'POST',
            body: JSON.stringify(material),
            credentials: 'include',
        })
        .then((result) => {
            if (result.ok) {
                console.log("Add material successfully");
                open = false;
                emptyMaterial();
                reload();
            }

            return result.json();
        })
    }

    function handleDelete(event) {
        fetch(conf.api + '/auth/deleteJobMaterial/' + event.detail.body.ID, {
            method: 'DELETE',
            credentials: 'include',
        })
        .then((response) => {
            if (response.ok) {
                reload();
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    const table_config = {
    name: 'Construction Cost',
    options: ['EDIT', 'CREATE', 'DELETE'],
    columns_setting: [
        {name: 'ID', show: false, edit: false, width: '0px'},
        {name: 'StageName', show: true, edit: false, width: '150px', tooltip: true},
        {name: 'SubStageName', show: true, edit: false, width: '150px', tooltip: true},
        {name: 'JobName', show: true, edit: false, width: '150px', tooltip: true},
        {name: 'MaterialName', show: true, edit: true, width: '150px', tooltip: true},
        {name: 'MaterialCost', show: true, edit: true, width: '50px'},
        {name: 'Unit', show: true, edit: false, with: '50px'},
        {name: 'PropertyName', show: true, edit: false, width: '150px', tooltip: true}

    ],
    details_text: 'detail'   // replace the standard icon with an text-link
}

</script>

<h2>Material properties</h2>
<div class="material-settings" style="margin-top:20px;">
    {#if create}
        <div>
            <p>Create Material Form</p>
            <div class="add-material-form">
                <div>
                    <Textfield
                        required 
                        variant="filled"
                        class="text-field"
                        bind:value={material.materialName}
                        label="Material Name"/>

                    <Select variant="filled" class="material-select" bind:value={stageName} label='Stage'>
                        {#each stageNames as stage}
                            <Option value={stage}>{stage}</Option>
                        {/each}
                    </Select>
        
                    {#if stageName}
                        <Select variant="filled" class="material-select" bind:value={jobName} label='Job'>
                            {#each jobStageMap[stageName] as job}
                                <Option value={job.JobName}>{job.JobName}</Option>
                            {/each}
                        </Select>
                    {/if}

                    {#if jobName}
                        <Textfield
                            required 
                            variant="filled"
                            input$step="0.01"
                            type="number"
                            class="text-field"
                            suffix="$/{jobsViewModel.find(x => x.JobName == jobName).PropertyUnit}"
                            bind:value={material.materialCost}
                            label="Material Cost"/>
                    {/if}
                
                </div>
                <div>
                    <Button variant="raised" on:click={createMaterial}>
                        <Label>Create</Label>
                    </Button>
                    <Button on:click={() => (create = false)}>
                        <Label>Cancel</Label>
                    </Button>
                </div>
            </div>
        </div>
    {/if}
    <SvelteGenericCrudTable
        on:update={handleUpdate}
        on:sort={handleSort}
        on:create={handleCreate}
        on:delete={handleDelete}
        table_config={table_config}
        table_data={myData}/>
</div>

<style>
    :global(.table) {
        height: 500px;
        overflow: scroll;
    }

    :global(.material-settings .table) {
        height: auto;
    }

    .add-material-form {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    :global(.add-material-form .material-select) {
        margin: 10px;
    }

    :global(.add-material-form .text-field) {
        margin: 10px;
    }
</style>
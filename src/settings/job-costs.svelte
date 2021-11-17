<script>
    import SvelteGenericCrudTable from 'svelte-generic-crud-table';
    import { onMount } from 'svelte';
    import { getNotificationsContext } from 'svelte-notifications';

    const { addNotification } = getNotificationsContext();

    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    const sortStore = [];

    let myData = [];

    let jobProperties = [];

    const api = isProduction
        ? "https://houme-api.herokuapp.com"
        : "http://localhost:10000";

    onMount(() => {
        reload();
    })

    function get(url) {
        return fetch(api + url)
        .then((result) => {
            if (result.ok) {
                console.log("get job properties success");
            }

            return result.json();
        })
    }

    function reload() {
        get('/getJobProperties').then((resp) => {
            jobProperties = resp.data;
            resp.data.forEach(element => {
                element.StageName = element.Job.StageName;
                element.SubStageName = element.Job.SubStageName;
                element.JobName = element.Job.JobName;
                element.Currency = "$";
                element.PropertyName = element.Job.Property.PropertyName;
                element.PropertyUnit = element.Job.Property.PropertyUnit;
            });
            myData = resp.data;

        });
    }

    function getInvalidProperties(properties) {
        let invalidPropertiesNames = [];
        properties.forEach(property => {
            if (isNaN(property.value)) {
                invalidPropertiesNames.push(property.name);
            }
        });
        console.log(invalidPropertiesNames);

        invalidPropertiesNames.forEach(propertyName => {
            addNotification({
                id: Date.now(),
                text: propertyName + ' is invalid!',
                position: 'top-center',
                type: 'danger',
            });
        });

        return invalidPropertiesNames;
    }

    function handleUpdate(event) {
        console.log(event);

        let jobProp = event.detail.body;

        let constructionCost = parseFloat(jobProp.ConstructionCost);
        let constructionSpeed = parseFloat(jobProp.ConstructionSpeed);
        let constructionFixDurationInHours = parseFloat(jobProp.ConstructionFixDurationInHours);
        let maxWorkers = parseInt(jobProp.MaxWorkers);
        let minWorkers = parseInt(jobProp.MinWorkers);
        let optWorkers = parseInt(jobProp.OptWorkers);
        let constructionJobPropertyId = parseInt(jobProp.ConstructionJobPropertyId);

        let invalidProperties = getInvalidProperties([
            {name: "ConstructionCost", value: constructionCost},
            {name: "ConstructionFixDurationInHours", value: constructionFixDurationInHours},
            {name: "ConstructionSpeed", value: constructionSpeed},
            {name: "MaxWorkers", value: maxWorkers},
            {name: "MinWorkers", value: minWorkers},
            {name: "OptWorkers", value: optWorkers},
            {name: "ConstructionJobPropertyId", value: constructionJobPropertyId}
        ])

        let updatedJobProperty = jobProperties.find(x => x.ID == event.detail.body.ID);

        if (!!invalidProperties && invalidProperties.length > 0) {
            reload();
            return;
        }

        updatedJobProperty.ConstructionCost = constructionCost;
        updatedJobProperty.ConstructionSpeed = constructionSpeed;
        updatedJobProperty.ConstructionFixDurationInHours = constructionFixDurationInHours;
        updatedJobProperty.MaxWorkers = maxWorkers;
        updatedJobProperty.MinWorkers = minWorkers;
        updatedJobProperty.OptWorkers = optWorkers;
        updatedJobProperty.ConstructionJobPropertyId = constructionJobPropertyId;

        fetch(api + '/updateJobProperty/'+ event.detail.body.ID,
        {
            method: 'PUT',
            body: JSON.stringify(updatedJobProperty)
        })
        .then((result) => {
            if (result.ok) {
                console.log("Updated job property successfully");
            }

            return result.json();
        })
        .then(data => {
            if (data.success) {
                reload();

                dispatch("reloadProjects");
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

    const table_config = {
    name: 'Construction Cost',
    options: ['EDIT'],
    columns_setting: [
        {name: 'ID', show: false, edit: false, width: '0px'},
        {name: 'ConstructionJobPropertyId', show: true, edit: false, width: '50px'},
        {name: 'StageName', show: true, edit: false, width: '150px', tooltip: true},
        {name: 'SubStageName', show: true, edit: false, width: '150px', tooltip: true},
        {name: 'JobName', show: true, edit: false, width: '150px', tooltip: true},
        {name: 'ConstructionSpeed', show: true, edit: true, width: '50px', description: 'The job'},
        {name: 'ConstructionCost', show: true, edit: true, width: '50px'},
        {name: 'Currency', show: true, edit: false, width: '50px'},
        {name: 'PropertyUnit', show: true, edit: false, width: '50px'},
        {name: 'PropertyName', show: true, edit: false, with: '50px'},
        {name: 'ConstructionFixDurationInHours', show: true, edit: false, width: '50px'},
        {name: 'MaxWorkers', show: true, edit: true, width: '50px'},
        {name: 'OptWorkers', show: true, edit: true, width: '50px'},
        {name: 'MinWorkers', show: true, edit: true, width: '50px'}

    ],
    details_text: 'detail'   // replace the standard icon with an text-link
}
</script>

<div>
    <h2>Job Properties</h2>
    <SvelteGenericCrudTable
        on:update={handleUpdate}
        on:sort={handleSort}
        table_config={table_config}
        table_data={myData}/>
</div>

<style>
    :global(.table) {
        height: 500px;
        overflow: scroll;
    }
</style>
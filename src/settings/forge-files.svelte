<script>
    import SvelteGenericCrudTable from 'svelte-generic-crud-table';
    import { onMount } from "svelte";
    
    import { config } from '../config';
    let conf = new config();

    let forgeFiles = [];

    function reload() {
        fetch(conf.api + '/auth/forgeGet', {credentials: 'include'})
        .then((result) => {
            if (result.ok) {
                console.log("get projects successfully");
            }

            return result.json();
        })
        .then((resp) => {
            forgeFiles = resp;
        });
    }

    function handleDelete(event) {
        fetch(conf.api + '/auth/deleteFile/' + event.detail.body.fileName, {
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

    onMount(() => {
        reload();
    });

    const table_config = {
        name: 'Forge files',
        options: ['DELETE'],
        columns_setting: [
            {name: 'bucketName', show: true, edit: false, width: '50px'},
            {name: 'fileName', show: true, edit: false, width: '50px'},
            {name: 'urn', show: true, edit: false, width: '700px'},
        ]
    }

</script>

<div class="forge-files-table">
    <h2>Forge Files</h2>
    <SvelteGenericCrudTable
        table_config={table_config}
        table_data={forgeFiles}
        on:delete={handleDelete}/>
</div>

<style>
    :global(.forge-files-table .table) {
        height: auto;
    }
</style>
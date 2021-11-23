<script>
    import Select, { Option } from '@smui/select';
 
    let foundationMaterial = ['Ribbon', 'Pile', 'Plate'];
    export let foundationMaterialValue = '';

    let wallMaterial = ['CLT', 'Foam block', 'Brick', 'Frame'];
    export let wallMaterialValue = '';

    let finishMaterial = ['Plaster', 'Ventfacade'];
    export let finishMaterialValue = '';

    let roofingMaterial = ['Fold', 'Soft Roof', 'Roof Tiles']
    export let roofingMaterialValue = '';

    let constructionWorkersNumber = ['Maximum', 'Optimal', 'Minimum']
    export let constructionWorkersNumberValue = '';
</script>

<div class="project-settings">
    <div>
        <div class="setting-container">
            <label for="construction-workers">Workers</label>
            <Select id="construction-workers" class="material-select" variant="outlined" bind:value={constructionWorkersNumberValue}>
                {#each constructionWorkersNumber as number}
                <Option value={number}>{number}</Option>
                {/each}
                <!-- <svelte:fragment slot="helperText">Number of construction workers on each stage.</svelte:fragment> -->
            </Select>
        </div>
        <div class="setting-container">
            <label for="foundation-material">Foundation</label>
            <Select id="foundation-material" class="material-select" variant="outlined" bind:value={foundationMaterialValue}>
                {#each foundationMaterial as material}
                <Option class="material-option" value={material}>{material}</Option>
                {/each}
            </Select>
        </div>
        <div class="setting-container">
            <label for="wall-material">Wall</label>
            <Select id="wall-material" class="material-select" variant="outlined" bind:value={wallMaterialValue}>
                {#each wallMaterial as material}
                <Option value={material}>{material}</Option>
                {/each}
            </Select>
        </div>
        <div class="setting-container">
            <label for="finish-material">Finish</label>
            <Select id="finish-material" class="material-select" variant="outlined" bind:value={finishMaterialValue}>
                {#each finishMaterial as material}
                <Option value={material}>{material}</Option>
                {/each}
            </Select>
        </div>
        <div class="setting-container">
            <label for="roofing-material">Roofing</label>
            <Select id="roofing-material" class="material-select" variant="outlined" bind:value={roofingMaterialValue}>
                {#each roofingMaterial as material}
                <Option value={material}>{material}</Option>
                {/each}
            </Select>
        </div>
    </div>  
</div>

<style>
    .setting-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    :global(.project-settings .material-select) {
        width: 60%;
        margin: 5px 0;
    }

    :global(.project-settings .mdc-select__anchor) {
        height: 40px;
    }
</style>
<script>
    import Select, { Option } from '@smui/select';
    import { _ } from '../services/i18n';
 
    let foundationMaterial = [{name: $_('projectOptions.ribbon'), value: "Ribbon"}, {name: $_('projectOptions.pile'), value: "Pile"}, {name: $_('projectOptions.plate'), value: "Plate"}];
    export let foundationMaterialValue = '';

    let wallMaterial = [{name: $_('projectOptions.CLT'), value: "CLT"}, {name: $_('projectOptions.foamBlock'), value: "Foam block"}, {name: $_('projectOptions.brick'), value: "Brick"}, {name: $_('projectOptions.frame'), value: "Frame"}];
    export let wallMaterialValue = '';

    let finishMaterial = [{name: $_('projectOptions.plaster'), value: "Plaster"}, {name: $_('projectOptions.ventfacade'), value:"Ventfacade"}];
    export let finishMaterialValue = '';

    let roofingMaterial = [{name: $_('projectOptions.fold'), value: "Fold"}, {name: $_('projectOptions.softRoof'), value: "Soft Roof"}, {name: $_('projectOptions.roofTiles'), value: "Roof Tiles"}]
    export let roofingMaterialValue = '';

    let constructionWorkersNumber = [{name: $_('projectOptions.max'), value: "Maximum"},{name: $_('projectOptions.opt'), value: "Optimal"},{name: $_('projectOptions.min'), value: "Minimum"}]
    export let constructionWorkersNumberValue = '';
</script>

<div class="project-settings">
    <div>
        <div class="setting-container">
            <label for="construction-workers">{$_('projectOptions.workers')}</label>
            <Select id="construction-workers" class="material-select" variant="outlined" bind:value={constructionWorkersNumberValue}>
                {#each constructionWorkersNumber as number}
                <Option value={number.value}>{number.name}</Option>
                {/each}
                <!-- <svelte:fragment slot="helperText">Number of construction workers on each stage.</svelte:fragment> -->
            </Select>
        </div>
        <div class="setting-container">
            <label for="foundation-material">{$_('projectOptions.foundation')}</label>
            <Select id="foundation-material" class="material-select" variant="outlined" bind:value={foundationMaterialValue}>
                {#each foundationMaterial as material}
                <Option class="material-option" value={material.value}>{material.name}</Option>
                {/each}
            </Select>
        </div>
        <div class="setting-container">
            <label for="wall-material">{$_('projectOptions.wall')}</label>
            <Select id="wall-material" class="material-select" variant="outlined" bind:value={wallMaterialValue}>
                {#each wallMaterial as material}
                <Option value={material.value}>{material.name}</Option>
                {/each}
            </Select>
        </div>
        <div class="setting-container">
            <label for="finish-material">{$_('projectOptions.finish')}</label>
            <Select id="finish-material" class="material-select" variant="outlined" bind:value={finishMaterialValue}>
                {#each finishMaterial as material}
                <Option value={material.value}>{material.name}</Option>
                {/each}
            </Select>
        </div>
        <div class="setting-container">
            <label for="roofing-material">{$_('projectOptions.roofing')}</label>
            <Select id="roofing-material" class="material-select" variant="outlined" bind:value={roofingMaterialValue}>
                {#each roofingMaterial as material}
                <Option value={material.value}>{material.name}</Option>
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

    :global(.project-settings .material-select .mdc-notched-outline__leading, .project-settings .material-select .mdc-notched-outline__trailing) {
        border-color: #D6D6D6;
    }

    :global(.project-settings .mdc-select__anchor) {
        height: 34px;
    }

    .setting-container label {
        display: inline-block;
        text-overflow: ellipsis;
        width: 40%;
        overflow: hidden;
    }

    @media only screen and (max-width:839px)
    {
        .project-settings {
            padding: 8px 0;
        }
    }
</style>
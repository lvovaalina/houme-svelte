<script>
    import Select, { Option } from '@smui/select';
 
    let foundationMaterial = ['Tape', 'Pile', 'Slab'];
    export let foundationMaterialValue = 'Tape';

    let wallMaterial = ['CLT', 'Foam Block', 'Brick', 'Frame'];
    export let wallMaterialValue = 'CLT';

    let finishMaterial = ['Plaster', 'Ventilation Facade'];
    export let finishMaterialValue = 'Plaster';

    let roofingMaterial = ['Seam Roof', 'Soft Roofind', 'Roof Tiles']
    export let roofingMaterialValue = 'Seam Roof';

    let constructionWorkersNumber = ['Maximum', 'Optimal', 'Minimum']
    export let constructionWorkersNumberValue = 'Optimal';

    let constructionCompanyName = ['Construction']
</script>

<div class="project-setting">
    <div>
        <p>Construction Workers</p>
        <Select variant="filled" class="material-select" bind:value={constructionWorkersNumberValue} label='Construction Workers'>
            {#each constructionWorkersNumber as number}
            <Option value={number}>{number}</Option>
            {/each}
            <svelte:fragment slot="helperText">Number of construction workers on each stage.</svelte:fragment>
        </Select>
    </div>
    <div>
        <p>Materials</p>
        <Select required variant="filled" class="material-select" bind:value={foundationMaterialValue} label="Foundation">
            {#each foundationMaterial as material}
            <Option class="material-option" value={material}>{material}</Option>
            {/each}
        </Select>
        <Select required variant="filled" class="material-select" bind:value={wallMaterialValue} label="Wall">
            {#each wallMaterial as material}
            <Option value={material}>{material}</Option>
            {/each}
        </Select>
        <Select required variant="filled" class="material-select" bind:value={finishMaterialValue} label="Finish">
            {#each finishMaterial as material}
            <Option value={material}>{material}</Option>
            {/each}
        </Select>
        <Select required variant="filled" class="material-select" bind:value={roofingMaterialValue} label="Roofing">
            {#each roofingMaterial as material}
            <Option value={material}>{material}</Option>
            {/each}
        </Select>
       
    </div>
</div> 
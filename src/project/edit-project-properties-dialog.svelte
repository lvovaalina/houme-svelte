<script>
    import Dialog, { Title, Content, Actions } from '@smui/dialog';
    import Select, { Option } from '@smui/select';
    import Button, { Label as ButtonLabel } from '@smui/button';
 
    let foundationMaterial = ['Tape', 'Pile', 'Slab'];
    let foundationMaterialValue = 'Tape';

    let wallMaterial = ['CLT', 'Foam Block', 'Bricks', 'Carcass'];
    let wallMaterialValue = 'CLT';

    let finishMaterial = ['Plaster', 'Ventilation Facade'];
    let finishMaterialValue = 'Plaster';

    let roofingMaterial = ['Seam Roof', 'Soft Roofind', 'Roof Tiles']
    let roofingMaterialValue = 'Seam Roof';

    let constructionWorkersNumber = ['Maximum', 'Optimal', 'Minimum']
    let constructionWorkersNumberValue = 'Optimal';

    export let open;

    export let stages;
</script>

<Dialog
    bind:open
    aria-labelledby="large-scroll-title"
    aria-describedby="large-scroll-content"
    surface$style="width: 500px; max-width: calc(100vw - 32px);"
    class="manage-project-parameters-dialog"
    >
    <Content id="large-scroll-content">
        <div class="columns margins">
            <Title class="project-settings-dialog-title">Project Settings</Title>
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
                    <Select variant="filled" class="material-select" bind:value={foundationMaterialValue} label="Foundation">
                        {#each foundationMaterial as material}
                        <Option class="material-option" value={material}>{material}</Option>
                        {/each}
                    </Select>
                    <Select variant="filled" class="material-select" bind:value={wallMaterialValue} label="Wall">
                        {#each wallMaterial as material}
                        <Option value={material}>{material}</Option>
                        {/each}
                    </Select>
                    <Select variant="filled" class="material-select" bind:value={finishMaterialValue} label="Finish">
                        {#each finishMaterial as material}
                        <Option value={material}>{material}</Option>
                        {/each}
                    </Select>
                    <Select variant="filled" class="material-select" bind:value={roofingMaterialValue} label="Roofing">
                        {#each roofingMaterial as material}
                        <Option value={material}>{material}</Option>
                        {/each}
                    </Select>
                   
                </div>
            </div>           
        </div>
    </Content>
    <Actions>
        <Button>
            <ButtonLabel>Cancel</ButtonLabel>
        </Button>
        <Button action="accept">
            <ButtonLabel>Done</ButtonLabel>
        </Button>
    </Actions>
</Dialog>

<style>
    /* .materials-setting, .construction-workers-setting {
        display: flex;
        justify-content: left;
        margin-bottom: 10px;
    } */

    :global(.material-select) {
        margin: 10px;
    }

    :global(.project-settings-dialog-title) {
        padding: 0;
    }
</style>
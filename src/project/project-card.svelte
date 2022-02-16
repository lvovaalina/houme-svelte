<script>
    import Button, { Label } from '@smui/button';
    import ProjectSettings from './project-settings.svelte';

    import { createEventDispatcher } from "svelte";
    import { numberWithCommas } from '../utils';
    import { _ } from '../services/i18n';

    const dispatch = createEventDispatcher();

    export let project = {};
    export let currency = '';

    function updateProject() {
        dispatch("apply");
    }
</script>

<div class="card-header-container-responsive">
    <h3 class="card-header" style="margin-top: 0;">{$_('details.projectDetailsCard.title')}</h3>
</div>

<div class="property-table-container responsive-box-shadow">
    <table class="property-table" aria-label="Project properties" style="width: 100%;">
        <tr>
            <td>{$_('details.projectDetailsCard.area')}</td>
            <td class="numeric-row">{project.LivingArea}&#13217;</td>
        </tr>
        <tr>
            <td>{$_('details.projectDetailsCard.projectCost')}</td>
            <td class="numeric-row">{currency + numberWithCommas(project.ConstructionCost)}</td>
        </tr>
        <tr>
            <td>{$_('details.projectDetailsCard.jobCost')}</td>
            <td class="numeric-row">{currency + numberWithCommas(project.ConstructionJobCost)}</td>
        </tr>
        <tr>
            <td>{$_('details.projectDetailsCard.materialCost')}</td>
            <td class="numeric-row">{currency + numberWithCommas(project.ConstructionMaterialCost)}</td>
        </tr>
        <tr>
            <td>{$_('details.projectDetailsCard.duration')}</td>
            <td class="numeric-row">{project.ConstructionDuration} days</td>
        </tr>
        <tr>
            <td>{$_('details.projectDetailsCard.workers')}</td>
            <td class="numeric-row">{project.Workers}</td>
        </tr>
        <tr>
            <td>{$_('details.projectDetailsCard.margin')}</td>
            <td class="numeric-row">{currency + numberWithCommas(project.Margin)}</td>
        </tr>
    </table>

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
            <div class="property-name">Workers</div>
            <div class="property-value">{project.Workers}</div>
        </div>
    </div>
</div>

<div class="divider"/>
<div class="card-header-container-responsive">
    <h3 class="card-header">{$_('details.projectDetailsCard.options')}</h3>
</div>

<div class="materials-block responsive-box-shadow">
    <p class="helper-text">{$_('details.projectDetailsCard.helperText')}</p>
    <ProjectSettings
        bind:foundationMaterialValue={project.FoundationMaterial}
        bind:wallMaterialValue={project.WallMaterial}
        bind:finishMaterialValue={project.FinishMaterial}
        bind:roofingMaterialValue={project.RoofingMaterial}
        bind:constructionWorkersNumberValue={project.ConstructionWorkersNumber}>
    </ProjectSettings>

    <Button
        style="margin-top: 10px;text-align: left;background-color: #2D62E8; color: white; align-self: flex-end;"
        class="apply-button"
        variant="filled" on:click={updateProject}>
        <Label>{$_("details.projectDetailsCard.recalculate")}</Label>
    </Button>
</div>

<div class="card-header-container-responsive">

</div>

<style>
    .helper-text {
        margin: -16px 0 10px 0;
        color: rgba(0, 0, 0, 0.55);
        font-size: 14px;
        line-height: 18px;
    }

    .property-table tr {
        height: 30px;
    }

    .property-grid-responsive {
        display: none;
    }

    @media only screen and (max-width:839px)
    {
        .helper-text {
            margin: 0;
            color: rgba(0, 0, 0);
        }

        .divider {
            display: none;
        }

        :global(.apply-button) {
            width: 100%;
        }

        .property-grid-responsive {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
        }

        .property-details-grid-cell {
            width: 33%;
            margin-bottom: 16px;
        }

        .property-details-grid-cell:last-of-type {
            margin-bottom: 0;
        }

        .property-table {
            display: none;
        }

        :global(.property-name) {
            text-transform: uppercase;
            opacity: 70%;
            font-size: 13px;
            font-weight: 500;
        }
        
        .card-header-container-responsive {
            height: 43px;
            background-color: #F5F7FA;
            text-transform: uppercase;
            margin: 0 -14px;
            padding-left: 14px;
            display: flex;
            align-items: flex-end;
            opacity: 70%;
        }

        .card-header-container-responsive h3 {
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 8px;
        }

        .card-header-container-responsive:last-of-type {
            height: calc(100vh - 571px - 38px - 36px);
        }

        .materials-block, .property-table-container {
            margin: 0 -14px;
            padding: 16px 14px;
        }

        :global(.project-settings .mdc-select__anchor) {
            height: 38px;
        }
    }
</style>
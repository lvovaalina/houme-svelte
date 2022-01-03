<script>
	import Dashboard from "./dashboard/dashboard.svelte";
	import Settings from "./settings/settings.svelte";
	import { Router, Route } from "svelte-navigator";
	import "../public/material-colors.min.css";
	import { pageTitle, responsive } from './store';
	import Analytics from './common/analytics.svelte';

	import Header from "./common/header.svelte";

	export let url = "";
	import Notifications from 'svelte-notifications';
	import ProjectViewer from "./project/project-viewer.svelte";
	import { onMount } from "svelte";

	let envmt = env;
	pageTitle.subscribe(value => {
		document.title = value.title + ' | Houmly';
	});

	onMount(() => {
		if (window.screen.width < 839) {
			responsive.set(true);
		}
	})
</script>

<main>
	<Analytics></Analytics>
	<Notifications>
	<Router url="{url}">
		<Header />
		<Route path="view/:projectId" let:params>
			<ProjectViewer projectId={params.projectId} active='Model'></ProjectViewer>
		</Route>
    	<Route path="/"><Dashboard/></Route>
		<Route path="/settings" component="{Settings}"></Route>
		<Route path="view/:projectId/model" let:params>
			<ProjectViewer projectId={params.projectId} active='Model'></ProjectViewer>
		</Route>
		<Route path="view/:projectId/timeline" let:params>
			<ProjectViewer projectId={params.projectId} active='Timeline'></ProjectViewer>
		</Route>
		<Route path="view/:projectId/jobs" let:params>
			<ProjectViewer projectId={params.projectId} active='Jobs'></ProjectViewer>
		</Route>
		<Route path="view/:projectId/materials" let:params>
			<ProjectViewer projectId={params.projectId} active='Materials'></ProjectViewer>
		</Route>
		<Route path="view/:projectId/details" let:params>
			<ProjectViewer projectId={params.projectId} active='Details'></ProjectViewer>
		</Route>
	</Router>
	</Notifications>

	{#if (envmt != "production") } 
	<div class="version-container">version: 0.4.00</div>
	{/if}
</main>

<style>
	main {
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	.version-container {
		position: -webkit-sticky;
		position: absolute;
		bottom: 0;
		height: 30px;
		width: 100vw;
	}

	@media only screen and (max-width:839px)
    {
		.version-container {
			display: none
		}
	}
</style>
<script>
	import Dashboard from "./dashboard/dashboard.svelte";
	import Settings from "./settings/settings.svelte";
	import { Router, Route } from "svelte-navigator";
	import "../node_modules/svelte-gantt/css/svelteGantt.css";
	import "../public/material-colors.min.css";

	import Header from "./common/header.svelte";

	export let url = "";
	import Notifications from 'svelte-notifications';
	import ProjectViewer from "./project/project-viewer.svelte";

	let envmt = env;
	let title = 'Project Dashboard';
	document.title = title + '| Houmly';
</script>

<main>
	<Notifications>
	<Router url="{url}">
		<Header bind:title={title}/>
		<Route path="view/:projectId" component="{ProjectViewer}" />
    	<Route path="/"><Dashboard/></Route>
		<Route path="/settings" component="{Settings}"></Route>
	</Router>
	</Notifications>

	{#if (envmt != "production") } 
	<div class="version-container">version: 0.2.4</div>
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
</style>
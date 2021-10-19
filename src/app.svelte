<script>
	import Dashboard from "./dashboard.svelte";
	import { Router, Route } from "svelte-navigator"

	import Header from "./header.svelte"

	export let url = "";
	import Notifications from 'svelte-notifications';
import ProjectViewer from "./project-viewer.svelte";
</script>

<main>
	<Notifications>
	<Router url="{url}">
		<Header/>
		<Route path="view/:urn" component="{ProjectViewer}" />
    	<Route path="/"><Dashboard/></Route>
	</Router>
	</Notifications>
</main>

<style>
	main {
		text-align: center;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
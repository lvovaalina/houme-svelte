<script>
	import Dashboard from "./dashboard.svelte";
	import ForgeViewer from "./forge-viewer.svelte";
	import { Router, Route, Link } from "svelte-navigator"

	import Header from "./header.svelte"

	export let url = "";
</script>

<main>
	
	<Router url="{url}">
		<Header/>
		<Route path="view" component="{ForgeViewer}" />
    	<Route path="/"><Dashboard/></Route>
	</Router>
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
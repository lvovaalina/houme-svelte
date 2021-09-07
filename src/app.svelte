<script>
import Dashboard from "./dashboard.svelte";

	import Header from "./header.svelte"
</script>

<main>
	<Header/>
	<Dashboard/>
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
<script>
	import Dashboard from "./dashboard/dashboard.svelte";
	import Settings from "./settings/settings.svelte";
	import { Router, Route } from "svelte-navigator";
	import "../public/material-colors.min.css";
	import "../public/global.css";
	import { pageTitle, responsive } from './store';
	import Analytics from './common/analytics.svelte';
	import UploadModel from './common/upload-model.svelte';
	import NotFound from './common/not-found.svelte';


    import { _, setupI18n, isLocaleLoaded, locale } from './services/i18n';

	import Header from "./common/header.svelte";

	export let url = "";
	import Notifications from 'svelte-notifications';
	import ProjectViewer from "./project/project-viewer.svelte";
	import { onMount } from "svelte";

	let envmt = env;
	pageTitle.subscribe(value => {
		document.title = value.title + ' | Houmly';
	});

	let lang = '';

	$: if (!$isLocaleLoaded) {
		let langSetting = 'pl';
		if (window.location.pathname.includes("en")) {
			langSetting = 'en';
			lang = langSetting + '/';
			console.log(langSetting);
		}
        setupI18n({ withLocale: langSetting });
    }

	onMount(() => {
		
		if (window.screen.width < 839) {
			responsive.set(true);
		}
	})
</script>

<main>
	<Analytics></Analytics>
	<Notifications>
	{#if $isLocaleLoaded}
	<Router url="{url}" primary={false}>
		<Header />
		<Route path="{lang}view/:projectId" let:params>
			<ProjectViewer projectId={params.projectId} active='Model'></ProjectViewer>
		</Route>
    	<Route path="{lang}/"><Dashboard/></Route>
		<Route path="/settings" component="{Settings}"></Route>
		<Route path="{lang}view/:projectId/model" let:params>
			<ProjectViewer projectId={params.projectId} active='Model'></ProjectViewer>
		</Route>
		<Route path="{lang}view/:projectId/timeline" let:params>
			<ProjectViewer projectId={params.projectId} active='Timeline'></ProjectViewer>
		</Route>
		<Route path="{lang}view/:projectId/jobs" let:params>
			<ProjectViewer projectId={params.projectId} active='Jobs'></ProjectViewer>
		</Route>
		<Route path="{lang}view/:projectId/materials" let:params>
			<ProjectViewer projectId={params.projectId} active='Materials'></ProjectViewer>
		</Route>
		<Route path="{lang}view/:projectId/details" let:params>
			<ProjectViewer projectId={params.projectId} active='Details'></ProjectViewer>
		</Route>
		<Route path="{lang}/upload" let:params>
			<UploadModel />
		</Route>
		<Route path="*">
			<NotFound />
		</Route>
	</Router>
	{/if}
	</Notifications>


	{#if (envmt != "production") } 
	<div class="version-container">version: 0.4.16</div>
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
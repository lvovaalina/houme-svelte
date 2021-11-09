<script>
    import { onMount } from 'svelte';

    let resp;
    let forgeViewerElement;
    let viewer;

    export let urn = "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6aG91bWUvTHVrYS5ydnQ=";

    function onDocumentLoadSuccess(doc) {
        let viewable = doc.getRoot().getDefaultGeometry();
        if (viewable) {
            viewer.loadDocumentNode(doc, viewable).then(function(result) {
            console.log('Viewable Loaded!');
        }).catch(function(err) {
            console.warn('Viewable failed to load.');
            console.log(err);
            }
        )}
    }
    
    function onDocumentLoadFailure() {
        console.log("error");
    }
    
    async function getForgeToken(onSuccess) {
        let details = {
                    "client_id": "HjKvq1UCmrAOpHBp97m0lfgYEGEB7E2V",
                    "client_secret": "1wuJ3vwrxbqnuxjP",
                    "grant_type": "client_credentials",
                    "scope":"viewables:read",
                }

        var formBody = [];
        for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        
        const res = await fetch("https://developer.api.autodesk.com/authentication/v1/authenticate", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formBody
            });
        resp = await res.json();
        onSuccess(resp["access_token"], resp["expires_in"])
    }

    onMount(async () => {
        Autodesk.Viewing.Initializer({
            env: 'AutodeskProduction',
            api: 'derivativeV2',
            getAccessToken: getForgeToken
        }, () => {
            // Find the element where the 3d viewer will live.
            // Create and start the viewer in that element
            viewer = new Autodesk.Viewing.GuiViewer3D(forgeViewerElement);
            viewer.start();
            // Load the document into the viewer.
            Autodesk.Viewing.Document.load(
                'urn:'+ urn,
                onDocumentLoadSuccess.bind(this),
                onDocumentLoadFailure.bind(this));
        });
    });
</script>

<div bind:this={forgeViewerElement} class="forge-viewer">
</div>

<style>
    .forge-viewer {
        position: relative;
        /* -header height -tab header height - view project padding */
        height: calc(100vh - 64px - 56px - 24px);
    }
</style>
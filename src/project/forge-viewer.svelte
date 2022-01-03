<script>
    import { onMount } from 'svelte';

    export let forgeViewerClass;
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
                    "client_id": "iTsiwR4RGLuOJdyXz49v3szapWzzxGs3",
                    "client_secret": "xI2RjkCJiIbLEMPF",
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

    function loadViewable() {
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
    }

    function urnChanged() {
        loadViewable();
    }

    $: urnChanged(urn)

    onMount(async () => {
        loadViewable();
    });
</script>

<div bind:this={forgeViewerElement} class="{!!forgeViewerClass ? forgeViewerClass : "forge-viewer"}">
</div>

<style>
    .forge-viewer {
        position: relative;
        /* -header height -tab header height container bottom padding */
        height: calc(100vh - 64px - 76px - 20px);
    }

    .dashboard-height {
        height: 400px;
        position: relative;
    }

    @media only screen and (max-width:839px)
    {    
        .forge-viewer {
            height: calc(100vh - 38px - 43px - 12px - 36px);
            margin: 0 -14px;
        }
    }
</style>
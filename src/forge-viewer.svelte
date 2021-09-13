<script>
    import { onMount } from 'svelte';
    import LayoutGrid, { Cell } from "@smui/layout-grid"

    let resp;
    let forgeViewerElement;
    let viewer;

    export let urn;

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

<h1>Project view</h1>
<LayoutGrid>
    <Cell span={7}>
        <div bind:this={forgeViewerElement} class="forge-viewer">
        </div>
    </Cell>
    <Cell span={5}>
        <h2>Project Information</h2>
    </Cell>

</LayoutGrid>



<style>
    .forge-viewer {
        padding-left: 2em;
        position: relative;
        height: 450px;
    }
</style>
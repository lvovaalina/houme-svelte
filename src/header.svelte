<script>
	export let name;
</script>

<main>
    <header>
        <h1>Houme Admin</h1>
        <a>Upload project</a>
        <p>|</p>
        <a>View project</a>
    </header>
</main>

<style>
	header {
		text-align: center;
		max-height: 240px;
        width: 100%;
		margin: 0 auto;
        flex-direction: row;
        justify-content: space-between;
        display: inline-block;  
	}

    p {
        margin: 0;
        width: -moz-fit-content;
        width: fit-content;
    }

    h1 {
        text-align: start;
        width: -moz-fit-content;
        width: fit-content;
        margin: 0px;
        display: inline-block;
    }

    a {
        text-align: end;
    }
</style>
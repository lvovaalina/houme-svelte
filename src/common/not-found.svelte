<script>
    import { Link } from 'svelte-navigator';
    import { pageTitle } from '../store';

    pageTitle.set({
        title: "Page not found",
    })
</script>

<div style="text-align: center;">
    <h1>Oops!</h1>
    <h2>Page not found</h2>
    <div>
        <Link to="/">Go to dashboard</Link>
    </div>
    
</div>


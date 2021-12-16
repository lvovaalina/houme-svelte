<script>
    import Button, { Label } from '@smui/button';
    import Textfield from '@smui/textfield';

    import { config } from '../config';
    let conf = new config();
    let dataLoaded = true;

    let responseMessage = null;

    function emptyMassage(admin) {
        responseMessage = null;
    }
    $: emptyMassage(admin)

    export let isLoggedIn = false;

    let admin = {
        email: '',
        passwordString: '',
    }

    async function login() {
        dataLoaded = false;

        await fetch(conf.api + '/loginAdmin',
        {
            method: 'PUT',
            body: JSON.stringify(admin)
        })
        .then((result) => {
            if (result.ok) {
                console.log("Add successfully");
            }

            return result.json();
        })
        .then(data => {
            if (data.success) {
                //isLoggedIn = true;
                dataLoaded = true;
            } else {
                responseMessage = data.message;
            }
        })
    }

    async function register() {
        dataLoaded = false;

        await fetch(conf.api + '/registerAdmin',
        {
            method: 'POST',
            body: JSON.stringify(admin)
        })
        .then((result) => {
            if (result.ok) {
                console.log("Add successfully");
            }

            return result.json();
        })
        .then(data => {
            if (data.success) {
                dataLoaded = true;
            } else {
                responseMessage = data.message;
            }
        })
    }

    async function isLoggedInFetch() {
        await fetch(conf.api + '/isLoggedIn', {credentials: 'include'})
        .then((result) => {

            return result.json();
        })
        .then(data => {
            if (data.success) {
                dataLoaded = true;
            } else {
                responseMessage = data.message;
            }
        })
    }
</script>

<div class="login-form-container">
    <form id="login-form" on:submit|preventDefault="{login}">
        {#if !!responseMessage}
            <div>{responseMessage}</div>
        {/if}
        <Textfield 
            required variant="filled"
            class="text-field"
            bind:value={admin.email}
            label="Email"/>
        <Textfield
            required variant="filled"
            type="password" class="text-field"
            bind:value={admin.passwordString}
            label="Password" />
        <Button type="submit">
            <Label>Login</Label>
        </Button>
    </form>


    <Button on:click={isLoggedInFetch}>
        <Label>isLoggedIn</Label>
    </Button>
</div>

<style>
    .login-form-container {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
    }

    form {
        display: flex;
        flex-direction: column;
    }
</style>
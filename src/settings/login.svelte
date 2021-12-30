<script>
    import Button, { Label } from '@smui/button';
    import Textfield from '@smui/textfield';

    import { adminAuthentificated } from '../store';

    import { config } from '../config';
    let conf = new config();
    let dataLoaded = true;

    let responseMessage = null;

    function emptyMassage(admin) {
        responseMessage = null;
    }
    $: emptyMassage(admin)

    let admin = {
        email: '',
        passwordString: '',
    }
    
    async function login() {
        dataLoaded = false;
        admin.email = admin.email.trim();

        await fetch(conf.api + '/login',
        {
            method: 'POST',
            body: JSON.stringify(admin),
            credentials: 'include',
            mode: 'cors'
        })
        .then((result) => {
            if (result.ok) {
                console.log("Add successfully");
            }

            return result.json();
        })
        .then(data => {
            if (data.code == 200) {
                dataLoaded = true;
                adminAuthentificated.set(true);
            } else {
                responseMessage = data.message.charAt(0).toUpperCase() + data.message.slice(1);
            }
        })
    }
</script>

<div class="login-form-container">
    <form id="login-form" on:submit|preventDefault="{login}">
        {#if !!responseMessage}
            <div class="response-message">{responseMessage}</div>
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
</div>

<style>
    .response-message {
        color: red;
    }

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
<template>
    <div class="form__container">
        <form id="signin__form" @submit.prevent ref="form">
            <section class="errors__container" v-show="signinErrors.length > 0">
                <ul>
                    <li v-for="error in signinErrors">{{ error }}</li>
                </ul>
            </section>
            <fieldset>
                <legend>Iniciar sesión</legend>
                <label for="name">Nombre:</label>
                <input type="text" placeholder="Nombre" name="name" id="name" required maxlength="50" minlength="0" v-model="userSignData.username">
                <label for="password">Contraseña:</label>
                <input type="password" placeholder="Contraseña" name="password" id="password" required maxlength="50" minlength="0" v-model="userSignData.password">
                <button type="submit" @click="mySignInHandler">Iniciar sesión</button>
            </fieldset>
        </form>
        <NuxtLink to="/signup" class="form__redirection">¿No tienes cuenta? Haz click aquí</NuxtLink>
    </div>
</template>

<script setup>
    definePageMeta({
        middleware: 'auth',
        auth: {
            unauthenticatedOnly: true,
            navigateAuthenticatedTo: '/',
        }
    })
        
    const { signIn } = useAuth()

    // const notifyLoggedIn = useCookie('notifyLoggedIn')

    const form = ref(null)
    const userSignData = reactive({
                                    username: '',
                                    password: ''
                                    })
    const signinErrors = reactive([])


    const reportValidity = () => form.value.reportValidity()
    const mySignInHandler = async () => {

        if (!reportValidity()) {
            return null
        }

        signinErrors.length = 0
        const { username, password } = userSignData
        const { error, url } = await signIn('credentials', { username, password, redirect: false})

        if (error) {
            const messages = JSON.parse(error).messages
            for (let message of messages) {
                signinErrors.push(message)
            }
        } else {
            // notifyLoggedIn.value = true
            return navigateTo(url, { external: true })
        }

        userSignData.username = ''
        userSignData.password = ''
    }
</script>

<style lang="scss">
    @use '@/assets/styles/sass/abstracts/variables';
    @use '@/assets/styles/sass/abstracts/mixins';

    .form__container {
        @include mixins.center-flexbox;
        flex-direction: column;
        height: 90vh;
        margin-top: 10px;
        gap: 10px;
        #signin__form {
            @include mixins.sign-form-content(cornflowerblue, steelblue, royalblue);
            @include mixins.errors-content;
        }
        .form__redirection {
            font-size: 2em;
            color: variables.$link--color;
            &:visited {
                color: variables.$link-visited--color;
            }
            &:active {
                color: variables.$link-active--color;
            }
            &:focus-visible {
                outline: variables.$outline-focus;
            }
        }
    }

    @media screen and (max-height: 500px) {
        .form__container {
            height: auto;
            margin-bottom: 10px;
        }
    }

    @media screen and (min-width: 700px) {
        .form__container {
            #signin__form {
                display: flex;
                flex-direction: row;
                gap: 10px;
                margin-right: 10px;
            }
        }
    }
</style>
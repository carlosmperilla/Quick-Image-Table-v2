<template>
    <div class="form__container">
        <form id="signup__form" @submit.prevent ref="form">
            <section class="errors__container" v-show="signupErrors.length > 0">
                <ul>
                    <li v-for="error in signupErrors">{{ error }}</li>
                </ul>
            </section>
            <fieldset>
                <legend>Registro</legend>
                <label for="name">Nombre:</label>
                <input type="text" placeholder="Nombre" name="name" id="name" required maxlength="50" minlength="0" v-model="userSignData.username">
                <label for="email">Correo:</label>
                <input type="email" placeholder="Correo" name="email" id="email" required maxlength="256" minlength="0" v-model="userSignData.email">
                <label for="password1">Contraseña:</label>
                <input type="password" placeholder="Contraseña" name="password1" id="password1" required maxlength="50" minlength="0" v-model="userSignData.password1">
                <label for="password2">Contraseña (confirmación):</label>
                <input type="password" placeholder="Contraseña (confirmación)" name="password2" id="password2" required maxlength="50" minlength="0" v-model="userSignData.password2">
                <button type="submit" @click="mySignUpHandler">Registrar usuario</button>
            </fieldset>
        </form>
        <NuxtLink to="/signin" class="form__redirection">¿Ya tienes cuenta? Haz click aquí</NuxtLink>
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

    const notifyLoggedIn = useCookie('notifyLoggedIn')

    const form = ref(null)
    const userSignData = reactive({
                                    username: '',
                                    email: '',
                                    password1: '',
                                    password2: ''
                                    })
    const signupErrors = reactive([])


    const reportValidity = () => form.value.reportValidity()
    const mySignUpHandler = async () => {

        if (!reportValidity()) {
            return null
        }

        signupErrors.length = 0
        const { username, email, password1, password2 } = userSignData
        const { error, url } = await signIn('credentials', { username, email, password1, password2, redirect: false, callbackUrl: '/signup'})
        
        if (error) {
            const messages = JSON.parse(error).messages
            for (let message of messages) {
                signupErrors.push(message)
            }
        } else {
            notifyLoggedIn.value = true
            return navigateTo(url, { external: true })
        }

        userSignData.username = ''
        userSignData.email = ''
        userSignData.password1 = ''
        userSignData.password2 = ''
    }
</script>

<style lang="scss">
    @use '@/assets/styles/sass/abstracts/variables';
    @use '@/assets/styles/sass/abstracts/mixins';

    .form__container{
        @include mixins.center-flexbox;
        flex-direction: column;
        height: 90vh;
        margin-top: 10px;
        gap: 10px;
        #signup__form {
            @include mixins.sign-form-content(seagreen, darkgreen, darkolivegreen);
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
            #signup__form {
                display: flex;
                flex-direction: row;
                gap: 10px;
                margin-right: 10px;
            }
        }
    }
</style>
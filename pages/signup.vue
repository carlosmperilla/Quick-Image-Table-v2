<template>
    <div class="form__container">
        <form id="signup__form" @submit.prevent>
            <section class="errors__container" v-show="false">
                <ul>
                    <li></li>
                </ul>
            </section>
            <fieldset>
                <legend>Registro</legend>
                <label for="name">Nombre:</label>
                <input type="text" name="name" id="name" required>
                <label for="email">Correo:</label>
                <input type="email" name="email" id="email" required>
                <label for="password1">Contraseña:</label>
                <input type="password" name="password1" id="password1" required>
                <label for="password2">Contraseña (confirmación):</label>
                <input type="password" name="password2" id="password2" required>
                <button type="submit">Registrar usuario</button>
            </fieldset>
        </form>
        <NuxtLink to="/signin" class="form__redirection">¿Ya tienes cuenta? Haz click aquí</NuxtLink>
    </div>
</template>

<script setup>
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
</style>
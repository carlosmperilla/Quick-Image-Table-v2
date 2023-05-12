<template>
    <section class="page">
        <header>
            <h1>Quick Image Table v2</h1>
        </header>
        <section>
            <p>
                QuickImageTable es una herramienta para generar tablas de productos apoyadas con imágenes.
            </p>
            <p>
                Esta versión cuenta con ventajas y desventajas respecto a su versión v1.
            </p>
            <p>
                <a href="https://quickimagetable.netlify.app/" target="_blank">Link a QuickImageTable v1</a>
            </p>
            <h2>Ventajas</h2>
            <ul>
                <li><strong>Manejo multi-tabla:</strong> Se pueden manejar varias tablas por sesión, sin requerir de distintos navegadores.</li>
                <li><strong>Persistencia de datos asíncrona:</strong> Los datos se actualizan asíncronamente, por lo tanto, las tablas pueden revisarse sin actualizar la pestaña.</li>
                <li><strong>Privacidad (parcial):</strong> Al manejar sesiones, se pueden usar varias sesiones independientes por dispositivo.</li>
                <li><strong>Acciones asíncronas:</strong> Edición y eliminación asíncrona.</li>
                <li><strong>Mayor almacenamiento:</strong> De 2 a 3 veces más almacenamiento, en comparación a la versión v1</li>
            </ul>
            <h2>Desventajas</h2>
            <ul>
                <li><strong>No almacenamiento a largo plazo:</strong> La capacidad de almacenamiento gratuito es baja, 
                    por lo que al llegar a cierto límite, se bloquean las acciones, y posiblemente los datos sean borrados.
                    Si necesita preservar los datos o quiere extender el almacenamiento más allá de lo ofrecido de forma gratuita,
                    Puede escribir a mi correo disponible en la pestaña de contacto.</li>
                <li><strong>Funcionamiento online, no offline:</strong> La versión V1 usa el almacenamiento local en LocalStorage. V2 usa el almacenamiento en bases de dato remotas.</li>
            </ul>
        </section>
        <section class="authentication-box">
            <a href="/signup"><button class="authentication-box__signup__button" type="button">Registrarse</button></a>
            <a href="/signin"><button class="authentication-box__signin__button" type="button">Iniciar sesión</button></a>
        </section>
    </section>
</template>

<script setup>
</script>

<style lang="scss">
    h2 {
        margin-top: 30px;
    }
    .authentication-box {
        min-height: 10vh;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        gap: 20px;
        button {
            padding: 20px 10px;
            border-radius: 25px;
            border: none;
            box-shadow: 2px 2px 2px grey;
            font-size: 2em;
            font-weight: bold;
            color: antiquewhite;
            user-select: none;
            cursor: pointer;
            &.authentication-box__signup__button {
                background: forestgreen;
                box-shadow: 2px 2px 2px darkgreen;
            }
            &.authentication-box__signin__button {
                background-color: royalblue;
                box-shadow: 2px 2px 2px darkblue;
            }
            &:hover {
                filter: sepia(50%)
            }
        }
    }
</style>
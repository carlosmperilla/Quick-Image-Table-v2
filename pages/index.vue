<template>
    <section>
        <section v-if="status === 'authenticated'">
            <div class="logout__container">
                <button @click="handlerSignOut">🔓 Cerrar sesión</button>
            </div>
            <div class="select-stock__container">
                <label :class="{'selected-stock__label': currentStock === stock}" v-for="stock in stocks" :key="'label' + stock"><input type="radio" v-model="currentStock" :value="stock" >{{ stock }}</label>
                <button @click="addStock">💼 Añadir Stock</button>
            </div>
            <Stock v-for="stock in stocks" :key="stock" :stock-key="stock" v-show="stock === currentStock"/>
        </section>
        <PresentationNoLogin v-else/>
    </section>
</template>

<script setup>
    import { useNotification } from "@kyvg/vue3-notification";
    const { notify}  = useNotification()

    const { status, signOut, getSession } = useAuth()
    
    const notifyLoggedIn = useCookie('notifyLoggedIn')
    const notifyLoggedOut = useCookie('notifyLoggedOut')
    
    const currentStock = ref('1')
    const stocks = reactive(['1', '2', '3'])
    
    function addStock(){
        stocks.push(`${Number.parseInt(stocks[stocks.length-1]) + 1}`)
    }
    
    async function handlerSignOut(){
        notifyLoggedOut.value = true
        await signOut()
    }

    // Actualizacion de datos cada segundo.

    // CREAR Botones que representan a los stocks para escoger.
    // El ultimo (o el primero, si no hay más) es el de añadir stocks.
    // La acción es POST a stocks desde la API.

    // Atributos y eventos Stock. [VERIFICAR MANEJO DE ERRORES, con datos erroneos]
    // stock-key: para identificar al stock (extraida de la url)
    // stock-name: Nombre de tabla inicial (traido de petición a API).
    // @update-stock-name: Actualizador de nombre, dando petición PUT a API.
    // products: Los productos iniciales (traidos de la petición a API)
    // @update-products: Actualizador de products (cuando se editan), dando PUT a API (por cada producto editado).
    // @delete-products: Elimina productos, ejecutado por cada producto DELETE a API.
    // @delete-stock: Elimina la tabla entera, ejecuantdo DELETE al API del stock.
    // @create-product: Añade un producto al stock de la API con POST. 


    onMounted(() => {
        if (notifyLoggedIn.value){
            setTimeout(() => {
                notify({
                        type: "success",
                        text: "¡Inicio de sesión correcto!",
                        duration: 1000,
                    })
            }, 100)
            notifyLoggedIn.value = undefined
        }

        if (notifyLoggedOut.value){
            setTimeout(() => {
                notify({
                        type: "warn",
                        text: "Sesión cerrada correctamente!",
                        duration: 1000,
                    })
            }, 100)
            notifyLoggedOut.value = undefined
        }

        // RECARGA DE STOCKS
        // const counn = ref(0)
        // setInterval(async () => {
        //     await prueba.refresh()
            
        //     // console.log('refresh', prueba)
        //     console.log('error', prueba.error.value?.statusCode)
        //     console.log('error', prueba.error.value?.data)
        //     console.log('data', prueba.data.value)
        //     if (prueba.error.value?.statusCode !== undefined){
        //         await getSession()
        //         console.log('post-error')
        //     }
        //     counn.value++
        //     console.log(counn.value)
        // }, 3000)

    })

    // RECARGA DE STOCKS
    // const prueba = await useLazyFetch('/api/stocks/', {
    //     method: 'GET',
    // })

</script>

<style lang="scss">
    .logout__container {
        padding-top: 25px;
        padding-bottom: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        button {
            padding: 5px;
            border-radius: 10px;
            border: none;
            background: coral;
            color: floralwhite;
            font-size: 2.5em;
            font-weight: bold;
        }
    }

    .select-stock__container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        column-gap: 5px;
        row-gap: 10px;
        padding: 0px 20px;
        padding-bottom: 10px;
        label {
            background-color: cadetblue;
            color: whitesmoke;
            width: fit-content;
            height: fit-content;
            padding: 5px 10px;
            font-size: 1.5em;
            font-weight: 500;
            border-radius: 10px;
            input {
                display: none;
            }
            &.selected-stock__label {
                    background-color: steelblue;
                }
        }
        button {
            background-color: teal;
            color: whitesmoke;
            width: fit-content;
            height: fit-content;
            padding: 5px 10px;
            font-size: 1.5em;
            font-weight: bold;
            border-radius: 10px;
            border: none;
        }
    }

    @media screen and (min-width: 900px) {
        .logout__container {
            justify-content: flex-start;
            padding-left: 30px;
        }
    }
</style>
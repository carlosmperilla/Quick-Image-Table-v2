<template>
    <section>
        <section v-if="status === 'authenticated'">
            <div class="logout__container">
                <button @click="handlerSignOut" type="button">🔓 Cerrar sesión</button>
            </div>
            <div class="select-stock__container">
                <label tabindex="0" @keydown.enter="() => currentStock = stock.uuid" :class="{'selected-stock__label': currentStock === stock.uuid}" v-for="stock in stocks.data" :key="'label' + stock.uuid"><input type="radio" v-model="currentStock" :value="stock.uuid" >{{ stock.name }}</label>
                <button @click="showDialog">💼 Añadir Stock</button>
            </div>
            <Stock v-for="stock in stocks.data" :key="stock.uuid" :stock-key="stock.uuid" v-show="stock.uuid === currentStock"/>
            <dialog ref="dialog" @click.self="closeDialog" class="dialog__add-stock">
                <section class="dialog__inner-box">
                    <button
                        type="button"
                        ref="closeButton"
                        alt="Botón de 'Cerrar'"
                        title="Botón de 'Cerrar'"
                        @click="closeDialog" 
                        class="dialog__close-button"
                    >
                        <ClientOnly>
                            <font-awesome-icon :icon="['fas', 'circle-xmark']" />
                        </ClientOnly>
                    </button>
                    <form @submit.prevent>
                        <input v-model="stockName" type="text" maxlength="50" placeholder="Nombre de Tabla" required>
                        <button @click="addStock" type="submit">Crear Tabla</button>
                    </form>
                </section>
            </dialog>
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
    
    const currentStock = ref('')
    const stockName = ref('')
    const stocks = reactive({
        data: []
    })
    const dialog = ref(null)
    
    function showDialog(){
        dialog.value.showModal()
    }

    function closeDialog(){
        dialog.value.close()
    }

    async function addStock(){
        if (stockName.value.length > 0 && stockName.value.length <= 50){
            const { data, error } = await useFetch('/api/stocks/', {
              method: 'POST',
              headers: {
                "Content-Type": "application/json",
              },
              body: {
                name: stockName.value
              }
            })
            let typeNotify, textNotify
            if (error.value) {
                typeNotify = "error"
                textNotify = "Ha ocurrido un error, recargue la pagina."
            } else {
                typeNotify = "success"
                textNotify = "¡Tabla creada correctamente!"
                closeDialog()
            }
            notify({
                type: typeNotify,
                text: textNotify,
                duration: 1000,
            })
        }
        stockName.value = ""
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
        if (status.value === 'authenticated') {
            while (stockPending.value){}
            if (stocks.data.length > 0) {
                currentStock.value = stocks.data[0].uuid
            }

            let refreshInterval
            window.addEventListener("focus", () => {            
                refreshInterval = setInterval(async () => {
                    await stockRefresh()
                    if (stockError.value?.statusCode !== undefined){
                        await getSession()
                    }
                    stocks.data = stockData.value || stocks.data
                }, 1000)
            })

            window.addEventListener("blur", () => {
                clearInterval(refreshInterval)
            })
        }
    })

    const { data:stockData, error:stockError, refresh:stockRefresh, pending:stockPending } = await useLazyFetch('/api/stocks/', {
        method: 'GET',
    })
    stocks.data = stockData.value || stocks.data
    if (stocks.data.length > 0) {
        currentStock.value = stocks.data[0].uuid
    }
</script>

<style lang="scss">
    @use '@/assets/styles/sass/abstracts/variables';
    @use '@/assets/styles/sass/abstracts/mixins';
    
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
            @include mixins.selected-stock-design;
            background-color: cadetblue;

            input {
                display: none;
            }
            &.selected-stock__label {
                    background-color: steelblue;
                    &:hover {
                        filter: initial;
                    }
                }
            &:focus-visible {
                outline: none;
                border: variables.$outline-focus;
                border-width: 3px;
            }
            &:hover {
                filter: grayscale(.5);
            }
        }
        button {
            @include mixins.selected-stock-design;
            background-color: teal;
            border: none;
            user-select: none;
            &:hover {
                filter: sepia(33%);
            }
        }
    }

    .dialog__add-stock {
        form {
            margin: 5px;
            margin-top: 15px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
            button {
                border: none;
                border-radius: 5px;
                background-color: teal;
                color: whitesmoke;
                padding: 3px 5px;
                font-size: 2em;
                font-weight: bold;
                width: 100%;
                &:hover {
                    filter: sepia(.33);
                }
            }
            input {
                border-radius: 5px;
                border: 3px solid teal;
                padding-left: 1em;
                font-size: 2em;
                width: 100%;
            };
        }
    }

    @media screen and (min-width: 900px) {
        .logout__container {
            justify-content: flex-start;
            padding-left: 30px;
        }
    }
</style>
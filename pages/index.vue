<template>
    <section>
        <section v-if="isAuthenticated">
            <div class="logout__container">
                <button @click="handlerSignOut" type="button">🔓 Cerrar sesión</button>
            </div>
            <ClientOnly fallback-tag="span" fallback="Cargando stocks...">
                <div class="select-stock__container">
                    <label tabindex="0" @keydown.enter="() => currentStock = stock.uuid" :class="{'selected-stock__label': currentStock === stock.uuid}" v-for="stock in stocks.data" :key="'label' + stock.uuid"><input type="radio" v-model="currentStock" :value="stock.uuid" >{{ stock.name }}</label>
                    <button @click="showDialog">💼 Añadir Stock</button>
                </div>
                <Stock 
                    v-for="stock in stocks.data" 
                    :key="stock.uuid" 
                    v-show="stock.uuid === currentStock"
                    :stock-key="stock.uuid"
                />
                <p class="no-stocks--message" v-if="(typeof stockData) !== 'undefined' && stockLength === 0">
                    Sin stocks por el momento.
                </p>
                <template #fallback>
                    <p class="loading-stocks">Cargando información de tablas...</p>
                </template>
            </ClientOnly>
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

    const router = useRouter()
    const { status, signOut, getSession } = useAuth()
    
    const notifyLoggedIn = useCookie('notifyLoggedIn')
    const notifyLoggedOut = useCookie('notifyLoggedOut')
    
    const currentStock = ref('')
    const stockName = ref('')

    const stocks = useState('stocks', () => {
        return {
            data: []
        }
    })

    const dialog = ref(null)

    const isAuthenticated = computed(() => status.value === 'authenticated')
    const stockLength = computed(() => stocks.value.data.length)

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
        clearInterval(refreshInterval)
        await signOut()
    }

    function setCurrentStock(){
        if (stocks.value.data.length > 0) {
            currentStock.value = stocks.value.data[0].uuid
        }
    }

    let refreshInterval
    function loadRefreshInterval(){
        refreshInterval = setInterval(async () => {
            await stockRefresh()
            if (stockError.value?.statusCode !== undefined){
                await getSession()
            }
            stocks.value.data = stockData.value || stocks.value.data
        }, 1000)
    }

    watch(stockLength, () => {
        setCurrentStock()
    }, {
        immediate: true
    })

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
        if (isAuthenticated.value) {
            // while (stockPending.value){}
            
            loadRefreshInterval()

            window.addEventListener("focus", () => {            
                loadRefreshInterval()
            })

            window.addEventListener("blur", () => {
                clearInterval(refreshInterval)
            })
        }
    })

    const { data:stockData, error:stockError, refresh:stockRefresh, pending:stockPending } = isAuthenticated.value ? await useLazyFetch('/api/stocks/', {
        method: 'GET',
    }) : {}
    stocks.value.data = stockData?.value || stocks.value.data

    router.beforeEach((nextRoute, prevRoute) => {
        if (prevRoute.name === 'index') {
            clearInterval(refreshInterval)
        }
    })
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

    .loading-stocks,
    .no-stocks--message {
        height: 80vh;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3em;
        color: steelblue;
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
<template>
    <section>
        <section v-if="status === 'authenticated'">
            <button @click="signOut">Desloguear</button>
            <ProductTable 
                :products="products" 
                @update-product="updateProduct" 
                @reload-products="reloadProducts"
                @remove-products="removeProducts"
                @clean-products="clean"
                @show-dialog="showDialog"
            />
            <p class="no-products--message" v-if="products.length === 0">
                <ClientOnly>
                    <font-awesome-icon :icon="['fas', 'face-meh']"/>
                    No hay productos por el momento. <br>Añada clickeando en 
                    <font-awesome-icon :icon="['fas', 'circle-plus']"/>
                </ClientOnly>
            </p>
            <Teleport to="body">
                <dialog ref="dialog" @click.self="closeDialog">
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
                        <AddProduct 
                            :products="products" 
                            :is-started="isModalOpen"
                            @add-product="addProductAndPersist" 
                            @focus-close-button="focuscloseButton"
                        />
                    </section>
                </dialog>
            </Teleport>
        </section>
        <PresentationNoLogin v-else/>
    </section>
</template>

<script setup>
    import { useNotification } from "@kyvg/vue3-notification";
    const { status, signOut } = useAuth()
    const { notify}  = useNotification()

    const isModalOpen = ref(false)
    const products = reactive([])
    const dialog = ref(null)
    const closeButton = ref(null)
    
    function fillProducts(){
        let localProducts = localStorage.getItem('productsQuickImageTable')
        if (localProducts !== null) {
            return JSON.parse(localProducts)
        }
        return []
    }

    function showDialog(){
        dialog.value.showModal()
        isModalOpen.value = true
    }

    function closeDialog(){
        dialog.value.close()
        isModalOpen.value = false
    }

    function removeProducts(indexList) {
        try {            
            for (let index of indexList.sort((a, b) => b - a)) {
                products.splice(index, 1)
                localStorage.setItem('productsQuickImageTable', JSON.stringify(products))
            }
            notify({
                type: "error",
                text: "¡Productos eliminados correctamente!",
                duration: 500,
            });
        } catch (error) {
            console.error(error)
        }
    }

    function reloadProducts() {
        Object.assign(products, fillProducts())
    }

    function addProductAndPersist(product){
        products.push(product)
        localStorage.setItem('productsQuickImageTable', JSON.stringify(products))
        closeDialog()
        notify({
            title: "Producto añadido correctamente",
            text: `${product.name} - ${product.price} - ${product.quantity}`,
            type: "warn",
            duration: 1000
        })
    }

    function clean(){
        try {
            localStorage.setItem('productsQuickImageTable', '[]')
            products.length = 0
            notify({
                type: "error",
                text: "¡Tabla eliminada correctamente!",
                duration: 500,
            })
        } catch (error) {
            console.error(error)
        }
    }

    function updateProduct(index, value){
        let key = Object.keys(value)
        products[index][key] = value[key]
        localStorage.setItem('productsQuickImageTable', JSON.stringify(products))
    }

    function focuscloseButton() {
        closeButton.value.focus()
    }

    let notifyLoggedIn = useCookie('notifyLoggedIn')
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
    reloadProducts()
    })
</script>

<style>
    .no-products--message {
        text-align: center;
        font-size: 3em;
        color: steelblue;
    }
</style>
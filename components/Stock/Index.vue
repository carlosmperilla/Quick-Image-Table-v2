<template>
    <section>
        <ProductTable 
            :stock-key="stockKey"
            @update-product="updateProduct" 
            @remove-products="removeProducts"
            @clean-products="clean"
            @show-dialog="showDialog"
            @excess-space-error-trigger="$emit('excessSpaceErrorTrigger')"
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
                        :is-started="isModalOpen"
                        :stock-key="stockKey"
                        @add-product="addProductAndPersist" 
                        @focus-close-button="focuscloseButton"
                    />
                </section>
            </dialog>
        </Teleport>
    </section>
</template>

<script setup>
    import { useNotification } from "@kyvg/vue3-notification";
    const { notify}  = useNotification()

    const props = defineProps({
        stockKey: {
            type: String,
            required: true
        }
    })

    const emit = defineEmits(['excessSpaceErrorTrigger'])

    const stocks = useState('stocks')
    
    const isModalOpen = ref(false)
    const dialog = ref(null)
    const closeButton = ref(null)
                
    const products = computed(() => stocks.value.data.filter(stock => stock.uuid === props.stockKey)[0].products)
    
    function showDialog(){
        dialog.value.showModal()
        isModalOpen.value = true
    }

    function closeDialog(){
        dialog.value.close()
        isModalOpen.value = false
    }

    function removeProducts(uuidList) {
        try {
            uuidList.map(async uuid => {
                useFetch(`/api/products/${uuid}/`, {
                    method: 'DELETE',
                })
            })
            notify({
                type: "warn",
                text: "¡Productos eliminados correctamente!",
                duration: 500,
            });
        } catch (error) {
            console.error(error)
        }
    }

    async function addProductAndPersist(product){
        const { data, error } = await useFetch('/api/products/', {
              method: 'POST',
              headers: {
                "Content-Type": "application/json",
              },
              body: {
                ...product,
                stock: props.stockKey,
                image_base64: product.imageData,
                imageData: undefined
              }
            })

            let typeNotify, titleNotify
            if (error.value) {
                if (error.value?.data?.statusCode === 507) {
                    emit('excessSpaceErrorTrigger')
                }
                typeNotify = "error"
                titleNotify = "Ha ocurrido un error, recargue la pagina"
            } else {
                typeNotify = "warn"
                titleNotify = "Producto añadido correctamente"
                closeDialog()
            }

        closeDialog()
        notify({
            title: titleNotify,
            text: `${product.name} - ${product.price} - ${product.quantity}`,
            type: typeNotify,
            duration: 1000
        })
    }

    async function clean(){
        try {
            const { data, error } = await useFetch(`/api/stocks/${props.stockKey}/`, {
                method: 'DELETE',
            })
            notify({
                type: "error",
                text: "¡Tabla eliminada correctamente!",
                duration: 500,
            })
        } catch (error) {
            console.error(error)
        }
    }

    async function updateProduct(uuid, value){
        const { data, error } = await useFetch(`/api/products/${uuid}/`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
            },
            body: value
        })
        if (error.value) {
            if (error.value?.data?.statusCode === 507) {
                emit('excessSpaceErrorTrigger')
                let rootElement = document.documentElement
                rootElement.scrollTo({
                    top: 0,
                    behavior: "smooth"
                })
            }
        }
    }

    function focuscloseButton() {
        closeButton.value.focus()
    }
</script>

<style lang="scss">
    .no-products--message {
        text-align: center;
        font-size: 3em;
        color: steelblue;
    }
</style>
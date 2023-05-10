<template>
    <section class="add-product">
        <figure>
            <AddProductVideoCamera :hasPicture="hasPicture" v-if="isStarted" @get-image-data="(data) => productImageData = data"/>
            <img :src="productImageData" width="320" v-show="hasPicture" alt="Imagen de producto" title="Imagen de producto"/>
        </figure>
        <button
            type="button"
            @click="photoAction" 
            v-if="step === 0"
            class="add-product__button-take-photo"
        >
        <ClientOnly>
            <font-awesome-icon :icon="['fas', takePhotoIcon]" />
        </ClientOnly>
         {{ CameraControlButtonContent }}</button>
        <section v-show="hasPicture" class="add-product__box-arrow-buttons">
            <button
                type="button"
                ref="prevButton" 
                v-show="step > 0" 
                @click="prevStep" 
                class="add-product__box-arrow-buttons--left"
            >
                <ClientOnly>
                    <font-awesome-icon :icon="['fas', 'arrow-left']" />
                </ClientOnly>
                 {{ prevButtonContent }}
            </button>
            <button type="button" ref="nextButton" @click="nextStep" @keydown.tab="goNextTab">
                {{ nextButtonContent }}&nbsp;
                <ClientOnly>
                    <font-awesome-icon :icon="['fas', 'arrow-right']" />
                </ClientOnly>
            </button>
        </section>
        <AddProductForm 
            v-show="step === 1"
            ref="addProductForm"
            @press-next-button="nextStep"
            @focus-next-button="goNextButton"
        />
        <AddProductList
            v-show="isFormValid && step === 2"
        />
    </section>
</template>

<script setup>
    const props = defineProps({
        isStarted: {
            type: Boolean,
            required: true
        },
        stockKey: {
            type: String,
            required: true
        }
    })

    const stocks = useState('stocks')
    
    const emit = defineEmits(['addProduct', 'focusCloseButton'])

    // Constantes no reactivas.
    const prevButtonDefaultContent = 'Retroceder a "Tomar Foto"' 
    const nextButtonDefaultContent = 'Anexar más datos'
    const takePictureDefaultContent = 'Tomar foto de producto'

    const CameraControlButtonContent = ref(takePictureDefaultContent)
    const prevButtonContent = ref(prevButtonDefaultContent)
    const nextButtonContent = ref(nextButtonDefaultContent)
    const productImageData = ref('')
    const isFormValid = ref(false)
    const hasPicture = ref(false)
    const step = ref(0)
    
    const productInfo = reactive({
        name: '',
        price: 0,
        quantity: 0
    })
    
    const addProductForm = ref()
    const nextButton = ref(null)
    const prevButton = ref(null)

    provide('productInfo', productInfo)

    const products = computed(() => stocks.value.data.filter(stock => stock.uuid === props.stockKey)[0].products)
    const takePhotoIcon = computed(() => !hasPicture.value ? 'camera' : 'camera-rotate')

    // Funciones Generales.
    function capitalize(oldName){
        productInfo.name = oldName.charAt(0).toUpperCase() + oldName.slice(1)
    }

    function generateUniqueNameProduct(){
        let randomId = Math.round(Math.random()*(10**5)).toString()

        if (products.value.findIndex((product) => product.name === productInfo.name) !== -1) {
            productInfo.name += ' - ' + randomId
        }
    }

    function reset() {
        step.value = 0
        productImageData.value = ''
        hasPicture.value = false
        Object.assign(productInfo, {name: '', price: 0, quantity: 0})
        CameraControlButtonContent.value = takePictureDefaultContent
    }

    // Funciones de Evento.
    const prevStep = () => step.value > 0 ? step.value-- : step.value
    const nextStep = () => step.value < 3 ? step.value++ : step.value

    function goNextButton(){
        nextButton.value.focus()
    }

    function goNextTab(e){
        if (step.value === 1) {
            e.preventDefault()
            prevButton.value.focus()
        }
    }

    function photoAction() {

        let takePictureAgainText = 'Volver a tomar foto'

        if (hasPicture.value === true) {
            hasPicture.value = false
            CameraControlButtonContent.value = takePictureDefaultContent
            return null
        }

        hasPicture.value = true
        CameraControlButtonContent.value = takePictureAgainText
        
    }


    watch(step, () => {
        if (step.value === 0) {
            nextButtonContent.value = nextButtonDefaultContent
        }

        if (step.value === 1) {
            isFormValid.value = false
            prevButtonContent.value = prevButtonDefaultContent
            nextButtonContent.value = 'Vista previa'
            addProductForm.value.focus()
        }

        if (step.value === 2) {
            isFormValid.value = addProductForm.value.reportValidity()
            
            if (!isFormValid.value) {
                step.value--
                return null
            }

            capitalize(productInfo.name)
            prevButtonContent.value = 'Retroceder a "Formulario Producto"'
            nextButtonContent.value = 'Añadir producto a tabla'
        }

        if (step.value === 3) {
            // añadir a la tabla
            generateUniqueNameProduct()
            emit('addProduct', {imageData: productImageData.value, ...productInfo})
            reset()
        }
    })
</script>

<style lang="scss" scoped>
    @use '@/assets/styles/sass/components/add-product';
</style>
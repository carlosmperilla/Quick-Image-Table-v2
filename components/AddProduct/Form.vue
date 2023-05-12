<template>
    <form ref="form" class="add-product__form">
        <fieldset>
            <legend>Datos adicionales</legend>
            <label :for="'product-name' + stockKey">Nombre de producto:</label>
            <input ref="firstInput" type="text" :name="'product-name' + stockKey" :id="'product-name' + stockKey" v-model.trim="productInfo.name" required maxlength="50" @keydown.enter="nextInputFocus">
            <label :for="'product-price' + stockKey">Precio de producto:</label>
            <input type="number" :name="'product-price' + stockKey" :id="'product-price' + stockKey" v-model="productInfo.price" required min="0.0" step="any" @keydown.enter="nextInputFocus">
            <label :for="'product-quantity' + stockKey">Cantidad de producto:</label>
            <input 
                type="number" 
                :name="'product-quantity' + stockKey" 
                :id="'product-quantity' + stockKey"
                v-model="productInfo.quantity" 
                required 
                min="0" 
                @keydown.enter="$emit('pressNextButton')"
                @keydown.tab.prevent="$emit('focusNextButton')"
                >
        </fieldset>
    </form>
</template>

<script setup>
    const productInfo = inject('productInfo')
    const props = defineProps({
        stockKey: {
            type: String,
            required: true
        }
    })
    const emit = defineEmits(['pressNextButton', 'focusNextButton'])
    const form = ref(null)
    const firstInput = ref(null)
    const reportValidity = () => form.value.reportValidity()
    const focus = () => nextTick(() => firstInput.value.focus())

    function nextInputFocus(e) {
        let currentElement = e.target.nextElementSibling
        while (currentElement.tagName.toLowerCase() !== 'input') {
            currentElement = currentElement.nextElementSibling
            if (currentElement === null) break
        }
        currentElement.focus()
    }

    defineExpose({
        reportValidity,
        focus
    })
</script>

<style lang="scss" scoped>
    @use '@/assets/styles/sass/components/add-product-form';
</style>
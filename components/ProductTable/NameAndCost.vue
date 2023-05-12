<template>
    <section class="name-and-cost">
        <header>
            <h1>
                <label :for="'name-and-cost__input__name' + stockKey">Nombre:</label>
                <input
                    :id="'name-and-cost__input__name' + stockKey"
                    type="text"
                    maxlength="50"
                    minlength="1"
                    :value="nameTable"
                    @input="$emit('update:nameTable', $event.target.value)"
                >
            </h1>
            <span class="name-subtitle">Cambie el nombre de ser pertinente</span>
        </header>
        <h2>Costo total: <span class="cost-value">$ {{ totalCost.toLocaleString().replaceAll('.', ' ') }}</span></h2>
    </section>
</template>

<script setup>
    const props = defineProps({
        stockKey: {
            type: String,
            required: true
        },
        nameTable: {
            type: String,
            required: true
        },
        totalCost: {
            type: Number,
            required: true
        }
    })
    const emit = defineEmits(['update:nameTable'])
</script>

<style lang="scss" scoped>
    @use '@/assets/styles/sass/components/product-table-name-and-cost';
</style>
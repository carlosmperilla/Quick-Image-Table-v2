<template>
    <section class="product-table">
        <div
            v-show="loadingExportFile"
            class="loading-file-bar"
        ></div>
        <ProductTableNameAndCost
            v-model:name-table="nameTable"
            :total-cost="totalCost"
        />
        <section class="secondary-actions">
            <ProductTableMode
                v-model:current-mode="currentMode"
                :table-modes="tableModes"
                :checked-products="checkedProducts"
                @pre-removal-products="preRemovalProducts"
                @pre-clean-products="preCleanProducts"
            />
            <ProductTableExportPanel
                :has-products="products.length > 0"
                :name-table="nameTable"
                @create-pdf="createPDF"
                @create-zip="createZIP"
            />
        </section>
        <ProductTablePrincipalAction
            text="Ingresar producto"
            @show-dialog="$emit('showDialog')"
        />
        <ProductTableToggleTableStyle 
            :table-card="tableCard"
            @toggle-table-card="() => tableCard = !tableCard"
        />
        <section class="product-table__table-container">
            <ProductTableMainTable 
                ref="mainTable" 
                :table-modes="tableModes"
                :mode="currentMode" 
                :products="products" 
                :table-card="tableCard"
                @update-product="(uuid, value) => emit('updateProduct', uuid, value) "
                @add-removable-product="(uuid) => checkedProducts.push(uuid)"
                @substract-removable-product="(uuid) => checkedProducts.splice(checkedProducts.indexOf(uuid), 1)"
            />
        </section>
    </section>
</template>

<script setup>
    import JSZip from 'jszip' // Para generar el zip de imagenes.
    import saveAs from 'file-saver' // Para guardar el zip de imagenes.

    const props = defineProps({
        stockKey: {
            type: String,
            required: true
        }
    })
    
    const emit = defineEmits(['updateProduct', 'removeProducts', 'cleanProducts', 'showDialog'])
    
    const tableModes = {
        view: 'view',
        edit: 'edit',
        delete: 'delete'
    }

    // Nos permite mantener el modo de edición, 
    // aunque se cambie entre paginas de la aplicación web.
    const stocks = useState('stocks')
    const currentMode = useState(() => tableModes.view)
    
    const nameTable = ref('')
    const loadingExportFile = ref(false)
    const tableCard = ref(false)
    const inputChange = ref(false)
    const stockNameChange = ref(false)
    
    const checkedProducts = reactive([])
    
    const mainTable = ref()
    const products = computed(() => stocks.value.data.filter(stock => stock.uuid === props.stockKey)[0].products)
    const getStockName = computed(() => stocks.value.data.filter(stock => stock.uuid === props.stockKey)[0].name)

    const totalCost = computed(() => products.value.reduce(
            (accumulator, currentValue) => accumulator + currentValue.price*currentValue.quantity,
    0))

    // Funciones Generales
    function getPrintableElement(){
        let table = mainTable.value.getClone()
        let container = document.createElement('div')
        let tableNameContainer = document.createElement('h1')
        let totalCostContainer = document.createElement('h2')
        
        // Para que la tabla sea clasica y no tarjeta.
        table.classList.remove('table--card')

        tableNameContainer.innerText = nameTable.value
        tableNameContainer.style.textAlign = "center"

        totalCostContainer.innerText = 'Costo total: $ ' + totalCost.value.toString()
        totalCostContainer.style.textAlign = "left"
        totalCostContainer.style.marginBottom = "10pt"
        
        container.style.width = "595.28pt"  // Para que ocupe todo el ancho.
        container.append(tableNameContainer, totalCostContainer, table)

        return container
    }

    // Funciones Eventos
    function preRemovalProducts() {
        let nameProductToRemoval = checkedProducts.map((uuid) => products.value.filter(product => product.uuid === uuid)[0].name).join(', ')
        if (checkedProducts.length === 0) {
            alert('No hay productos para eliminar')
            return null
        }
        if (window.confirm(`¿Realmente quiere eliminar [${nameProductToRemoval}]?`)) {
            emit('removeProducts', checkedProducts)
            currentMode.value = tableModes.view
        }
    }

    function preCleanProducts() {
        if (window.confirm(`¿Realmente quiere eliminar la tabla entera?`)) {
            emit('cleanProducts')
            currentMode.value = tableModes.view
        }
    }

    function createPDF(){
        currentMode.value = tableModes.view // Forzamos el modo: vista.

        // Cuando se actualice el DOM clonamos y exportamos el PDF
        nextTick(async () => {
            let documentOptions = {
                    orientation: 'l',
                    unit: 'pt',
                    format: 'a4',
                    putOnlyUsedFonts: true,
                    floatPrecision: 'smart',
                    compress: true
                }
            let options = {
                    margin: [60, 30, 60, 30], // Para conservar unos margenes.
                    autoPaging:'text' // Evita que el texto aparezca cortado entre pagina y pagina.
                }

            let fileName =  nameTable.value !== '' ? `${nameTable.value}.pdf` : `${getStockName.value}.pdf`
            let container = getPrintableElement()

            loadingExportFile.value = true
            // https://sidebase.io/nuxt-pdf/getting-started/quick-start
            await exportToPDF(fileName, container, documentOptions, options)
            loadingExportFile.value = false
        })
    }

    function createZIP(){
        currentMode.value = tableModes.view

        nextTick(async () => {
            let zip = new JSZip()
            
            loadingExportFile.value = true
            products.value.map((product) => {
                let dataUrlIdentify = 'data:image/jpeg;base64,'
                let validFileName = product.name.replace(/[<>:"\\/|?*]/g, (c) => '')
                
                zip.file(
                    `${validFileName}.jpg`,
                    // Añadiendo nombre, precio y cantidad a la imagen, antes de empaquetar.
                    useImageWithData(product).replace(dataUrlIdentify, ''), 
                    {
                        base64: true
                    }
                )
            })

            // Espera para que aparezca el loader.
            // Mejor experienncia visual.
            setTimeout(async () => {
                let blobData = await zip.generateAsync({type:"blob"})
                await saveAs(blobData, `${nameTable.value}.zip`)
                loadingExportFile.value = false
            }, 300);
        })
    }

    watch(nameTable, async () => {
        if (stockNameChange.value){
            stockNameChange.value = false
            return null
        }
        inputChange.value = true
        const nameTableValue = nameTable.value
        const { data, error } = await useFetch(`/api/stocks/${props.stockKey}/`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: {
                name: nameTableValue
            }
        })
        inputChange.value = false
    })

    watch(getStockName, () => {
        if (!inputChange.value){
            nameTable.value = getStockName.value
            stockNameChange.value = true
        }
    }, {flush: 'post', immediate: true})

    watch(currentMode, () => {        
        if (currentMode.value === tableModes.delete) {
            checkedProducts.length = 0 // reseteamos la lista de productos checkeados.
        }
    })
</script>

<style lang="scss">
    @use '@/assets/styles/sass/abstracts/variables';
    
    .loading-file-bar {
        position: fixed;
        left: 0;
        top: 0;
        height: 3px;
        width: 100%;
        z-index: 50;
        background-color: lightseagreen;
    }

    .product-table {
        .secondary-actions {
            display: flex;
            padding-right: variables.$thumb-space;
        }

        .product-table__table-container {
            margin-top: 20px;
            margin-bottom: 50px;
            width: 100%;
            overflow: auto;
        }
    }

    @media screen and (min-width: 750px){
        .product-table {
            font-size: 1.15em;
        }
    }

    @media screen and (min-width: 1000px){
        .product-table {
            font-size: 1.35em;
            
        }
    }
</style>
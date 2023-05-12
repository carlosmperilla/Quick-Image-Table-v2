import { getToken } from '#auth'

export default eventHandler(async (event) => {
    const API_BASE = process.env.NUXT_API_BASE
    const token = await getToken({ event })
    const ForbiddenError = createError({
                                statusCode: 403,
                                statusMessage: 'Forbidden Error',
                            })
    let stockData

    if  (token === null) {
        throw ForbiddenError
    }

    try {        
        stockData = await $fetch('api/stocks/',{
            baseURL: API_BASE,
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${(token as any).api_access_token}`
            },
        });
    } catch (error) {
        console.warn(error)
        throw ForbiddenError
    }

    const newStockData = (stockData as any).results.map((stock: any) => {
        let regexUUID = /\/([a-f\d]{8}(-[a-f\d]{4}){3}-[a-f\d]{12}?)\//i
        let uuidStock = stock.url.match(regexUUID)[1]
        let products = stock.products.map((product: any) => {
            let uuidProduct = product.url.match(regexUUID)[1]
            return {
                ...product,
                uuid: uuidProduct,
                url: undefined
            }
        })
        return {
            ...stock, 
            products,
            uuid: uuidStock,
            url: undefined
        }
    })

    return newStockData
})

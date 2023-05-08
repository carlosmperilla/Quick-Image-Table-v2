import { getToken } from '#auth'

export default eventHandler(async (event) => {
    const token = await getToken({ event })
    const ForbiddenError = createError({
                                statusCode: 403,
                                statusMessage: 'Forbidden Error',
                            })
    let stockData

    if  (token === null) {
        throw ForbiddenError
    }

    const body = await readBody(event)
    // console.log('en api', bode, typeof bode)

    // return {}


    try {        
        stockData = await $fetch('api/stocks/',{
            baseURL: 'https://quickimage.pythonanywhere.com/',
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${(token as any).api_access_token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        });
    } catch (error) {
        console.warn(error)
        throw ForbiddenError
    }

    return {
        ...(stockData as any), 
        products: undefined,
        url: undefined
    }

    // return newStockData
})
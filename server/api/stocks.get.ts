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

    try {        
        stockData = await $fetch('api/stocks/',{
            baseURL: 'https://quickimage.pythonanywhere.com/',
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${(token as any).api_access_token}`
            },
        });
    } catch (error) {
        console.warn(error)
        throw ForbiddenError
    }

    const newStockData = (stockData as any).results.map((obj: any) => {
        let uuid = obj.url.match(/\/([a-f\d]{8}(-[a-f\d]{4}){3}-[a-f\d]{12}?)\//i)[1]
        return {
            ...obj, 
            uuid: uuid,
            url: undefined
        }
    })

    return newStockData
})

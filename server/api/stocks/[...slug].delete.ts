import { getToken } from '#auth'

export default eventHandler(async (event) => {
    const API_BASE = process.env.NUXT_API_BASE
    const slug = (event.context.params as any).slug
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
        stockData = await $fetch(`api/stocks/${slug}`,{
            baseURL: API_BASE,
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${(token as any).api_access_token}`,
            },
        });
    } catch (error) {
        console.warn(error)
        throw ForbiddenError
    }

    return stockData
})
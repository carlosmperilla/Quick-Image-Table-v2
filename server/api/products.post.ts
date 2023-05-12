import { getToken } from '#auth'

export default eventHandler(async (event) => {
    const API_BASE = process.env.NUXT_API_BASE
    const token = await getToken({ event })
    const ForbiddenError = createError({
                                statusCode: 403,
                                statusMessage: 'Forbidden Error',
                            })
    const InsufficientStorageError = createError({
        statusCode: 507,
        statusMessage: 'Insufficient Storage Error',
    })
    let productData

    if  (token === null) {
        throw ForbiddenError
    }

    const body = await readBody(event)

    try {
        productData = await $fetch('api/products/',{
            baseURL: API_BASE,
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${(token as any).api_access_token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...body,
                stock: `${API_BASE}api/stocks/${body.stock}/`
            })
        });
    } catch (error) {
        if ((error as any)?.data?.detail === "Cuota de almacenamiento excedida") {
            throw InsufficientStorageError
        }
        console.warn(error)
        throw ForbiddenError
    }

    return {
        ...(productData as any),
        url: undefined,
        stock: undefined
    }
})
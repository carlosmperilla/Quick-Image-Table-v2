import { getToken } from '#auth'

export default eventHandler(async (event) => {
    const token = await getToken({ event })
    const ForbiddenError = createError({
                                statusCode: 403,
                                statusMessage: 'Forbidden Error',
                            })
    const InsufficientStorageError = createError({
        statusCode: 507,
        statusMessage: 'Insufficient Storage Error',
    })
    let stockData

    console.log(process.env)

    if  (token === null) {
        throw ForbiddenError
    }

    const body = await readBody(event)

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
        if ((error as any)?.data?.detail === "Cuota de almacenamiento excedida") {
            throw InsufficientStorageError
        }
        console.warn(error)
        throw ForbiddenError
    }

    return {
        ...(stockData as any), 
        products: undefined,
        url: undefined
    }
})
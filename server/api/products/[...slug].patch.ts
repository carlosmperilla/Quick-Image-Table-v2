import { getToken } from '#auth'

export default eventHandler(async (event) => {
    const slug = (event.context.params as any).slug
    const token = await getToken({ event })
    const ForbiddenError = createError({
                                statusCode: 403,
                                statusMessage: 'Forbidden Error',
                            })
    const BadRequestError = createError({
        statusCode: 400,
        statusMessage: 'Bad Request Error',
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
    
    if (Object.keys(body).length !== 1){
        throw BadRequestError
    }

    try {        
        productData = await $fetch(`api/products/${slug}`,{
            baseURL: 'https://quickimage.pythonanywhere.com/',
            method: 'PATCH',
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
        ...(productData as any),
        image_base64: undefined,
        stock: undefined,
        url: undefined
    }
})
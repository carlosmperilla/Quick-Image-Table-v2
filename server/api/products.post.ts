import { getToken } from '#auth'
import { useFetch } from "#app"

const baseURL = 'https://quickimage.pythonanywhere.com/'

export default eventHandler(async (event) => {
    const token = await getToken({ event })
    const ForbiddenError = createError({
                                statusCode: 403,
                                statusMessage: 'Forbidden Error',
                            })
    let productData

    if  (token === null) {
        throw ForbiddenError
    }

    const body = await readBody(event)

    try {
        productData = await $fetch('api/products/',{
            baseURL,
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${(token as any).api_access_token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...body,
                stock: `${baseURL}api/stocks/${body.stock}/`
            })
        });
    } catch (error) {
        console.warn(error)
        throw ForbiddenError
    }

    return {
        ...(productData as any),
        url: undefined,
        stock: undefined
    }
})
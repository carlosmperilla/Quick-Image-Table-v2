import CredentialsProvider from 'next-auth/providers/credentials'
import { NuxtAuthHandler } from '#auth'


const API_BASE = process.env.NUXT_API_BASE
const secret = process.env.NUXT_SECRET

const pages =  {
                 signIn: '/signin'
               }

interface SingnInData {
  username: string,
  password: string
}

interface SingnUpData {
  username: string,
  email: string,
  password1: string,
  password2: string,
}

function isInvalidLength({ length } : { length: number }, bottomLimit: number, topLimit: number){
  return (length >= topLimit) || (length <= bottomLimit)
}

async function signInCredentials({ username, password } : SingnInData){
  const errors: {messages: string[]} = {messages: []}
  const credentialsUsername = username || '' 
  const credentialsPassword = password || ''
  let userData: Object;

  // return {id: 1, username: 'Ejemplo2', password: '123QWE###'}

  if (isInvalidLength(credentialsUsername, 0, 50)) {
    errors.messages.push('Longitud de usuario invalida.')
  }

  if (isInvalidLength(credentialsPassword, 0, 50)) {
    errors.messages.push('Longitud de password invalida.')
  }

  if (errors.messages.length > 0) {
    throw createError({
      statusCode: 401,
      statusMessage: JSON.stringify(errors),
    })
  }

  try {          
    const response : {access_token: string, refresh_token: string, user: any} = await $fetch('api/authentication/login/',{
      baseURL: API_BASE,
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
          username: credentialsUsername,
          password: credentialsPassword
      })
    })

    let { access_token, refresh_token, user } = response
    userData = {
                id: user.id,
                name: user.username,
                username: user.username,
                email: user.email,
                password: credentialsPassword,
                api_access_token: access_token,
                api_refresh_token: refresh_token 
              }
  } catch (error) {
    errors.messages.push('Verifique el usuario o contraseña.')
    throw createError({
      statusCode: 401,
      statusMessage: JSON.stringify(errors),
    })
  }

  return userData

}

async function signUpCredentials({ username, email, password1, password2 } : SingnUpData){
  const errors: {messages: string[]} = {messages: []}
  const credentialsUsername = username || '' 
  const credentialsEmail = email || ''
  const credentialsPassword1 = password1 || ''
  const credentialsPassword2 = password2 || ''
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  let userData: Object;

  if (isInvalidLength(credentialsUsername, 0, 50)) {
    errors.messages.push('Longitud de usuario invalida.')
  }

  if (isInvalidLength(credentialsPassword1, 0, 50)) {
    errors.messages.push('Longitud de password invalida.')
  }
  
  if (credentialsPassword1 !== credentialsPassword2) {
    errors.messages.push('Las contraseñas no coinciden')
  }
  
  if (isInvalidLength(credentialsEmail, 0, 256)) {
    errors.messages.push('Longitud de email invalida.')
  }

  if (!regexEmail.test(email)) {
    errors.messages.push('Formato de email invalido.')
  }

  if (errors.messages.length > 0) {
    throw createError({
      statusCode: 401,
      statusMessage: JSON.stringify(errors),
    })
  }

  try {          
    const response : {access_token: string, refresh_token: string, user: any} = await $fetch('api/registration/',{
      baseURL: API_BASE,
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
          username: credentialsUsername,
          email: credentialsEmail,
          password1: credentialsPassword1,
          password2: credentialsPassword2
      })
    })
    let { access_token, refresh_token, user } = response
    userData = {
                id: user.id,
                name: user.username,
                username: user.username,
                email: user.email,
                password: credentialsPassword1,
                api_access_token: access_token,
                api_refresh_token: refresh_token 
              }
  } catch (error:any) {
    errors.messages.push('Verifique sus datos de registro y vuelva a intentarlo.')
    if ('data' in error) {
      for (let message of Object.values(error.data).flat()){
        errors.messages.push(message as string)
      }
    }
    throw createError({
      statusCode: 401,
      statusMessage: JSON.stringify(errors),
    })
  }

  return userData
}


const providers = [
  // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
  CredentialsProvider.default({
    name: 'Credentials',
    credentials: {},
    async authorize (credentials: any) {
      let user
      if ('password' in credentials) {
        user = await signInCredentials(credentials)
      }
      if ('password1' in credentials){
        user = await signUpCredentials(credentials)
      }

      return user
    }
  }),
]

export default NuxtAuthHandler({
  secret,
  pages,
  providers,
  callbacks: {
    // Callback when the JWT is created / updated, see https://next-auth.js.org/configuration/callbacks#jwt-callback
    jwt: async ({token, user}) => {
      const isSignIn = user ? true : false;
      if (isSignIn){
        token.api_access_token = (user as any).api_access_token
        token.api_refresh_token = (user as any).api_refresh_token
      } else {
        try {
          const response : {access: string, access_token_expiration: string} = await $fetch('api/authentication/token/refresh/',{
            baseURL: API_BASE,
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              refresh: token.api_refresh_token,
            })
          })
          token.api_access_token = response.access
        } catch (error) {
          console.warn(error)
          return Promise.reject(token);
        }
      }
      return Promise.resolve(token);
    },
    // Callback whenever session is checked, see https://next-auth.js.org/configuration/callbacks#session-callback
    session: async ({session, token}) => {
      (session as any).api_access_token = (token as any).api_access_token
      return Promise.resolve(session);
    },
  },
})
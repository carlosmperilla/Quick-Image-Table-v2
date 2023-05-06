import CredentialsProvider from 'next-auth/providers/credentials'
import { NuxtAuthHandler } from '#auth'

const secret = 'your-secret-here'

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
  
  if (isInvalidLength(credentialsUsername, 0, 50)) {
    errors.messages.push('Longitud de usuario invalida.')
  }

  if (isInvalidLength(credentialsPassword, 0, 50)) {
    errors.messages.push('Longitud de password invalida.')
  }

  if (errors.messages.length > 0) {
    throw new Error( JSON.stringify(errors) )
  }

  try {          
    const response : {access_token: string, refresh_token: string} = await $fetch('api/authentication/login/',{
      baseURL: 'https://quickimage.pythonanywhere.com/',
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
          username: credentialsUsername,
          password: credentialsPassword
      })
    })

    let { access_token, refresh_token } = response
    console.log(access_token)
    console.log(refresh_token)
  } catch (error) {
    errors.messages.push('Verifique el usuario o contraseña.')
    throw new Error( JSON.stringify(errors) )
  }

  const user = { id: '1', name: 'J Smith', username: 'jsmith', password: 'hunter2' }
  return user

}

async function signUpCredentials({ username, email, password1, password2 } : SingnUpData){
  const errors: {messages: string[]} = {messages: []}
  const credentialsUsername = username || '' 
  const credentialsEmail = email || ''
  const credentialsPassword1 = password1 || ''
  const credentialsPassword2 = password2 || ''
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

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
    throw new Error( JSON.stringify(errors) )
  }

  try {          
    const response : {access_token: string, refresh_token: string} = await $fetch('api/registration/',{
      baseURL: 'https://quickimage.pythonanywhere.com/',
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
          username: credentialsUsername,
          email: credentialsEmail,
          password1: credentialsPassword1,
          password2: credentialsPassword2
      })
    })
    let { access_token, refresh_token } = response
    console.log(access_token)
    console.log(refresh_token)
  } catch (error:any) {
    errors.messages.push('Verifique sus datos de registro y vuelva a intentarlo.')
    if ('data' in error) {
      for (let message of Object.values(error.data).flat()){
        errors.messages.push(message as string)
      }
    }
    throw new Error( JSON.stringify(errors) )
  }

  const user = { id: '1', name: 'J Smith', username: 'jsmith', password: 'hunter2' }
  return user
}


const providers = [
  // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
  CredentialsProvider.default({
    name: 'Credentials',
    credentials: {},
    async authorize (credentials: any) {
      console.log(credentials)
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
})
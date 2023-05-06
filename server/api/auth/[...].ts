import CredentialsProvider from 'next-auth/providers/credentials'
import { NuxtAuthHandler } from '#auth'

export default NuxtAuthHandler({
  // A secret string you define, to ensure correct encryption
  secret: 'your-secret-here',
  pages: {
    signIn: '/signin'
  },
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    CredentialsProvider.default({
      name: 'Credentials',
      credentials: {},
      async authorize (credentials: any) {
        console.log(credentials)
        const credentialsUsername = credentials?.username || '' 
        const credentialsPassword = credentials?.password || '' 
        const firstCondition = (credentialsUsername.length <= 50) && (credentialsUsername.length === 0)
        const secondCondition = (credentialsPassword.length <= 50) && (credentialsPassword.length === 0)
        const errors: {messages: string[]} = {messages: []}
        
        if (firstCondition){
            errors.messages.push('Longitud de usuario invalida.')
        }
        
        if (secondCondition){
            errors.messages.push('Longitud de password invalida.')
        }

        if (errors.messages.length > 0) {
            throw new Error( JSON.stringify(errors) )
        }

        const user = { id: '1', name: 'J Smith', username: 'jsmith', password: 'hunter2' }

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

        return user
      }
    }),
  ]
})
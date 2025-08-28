import NextAuth from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";


console.log("These are the env credentials ", process.env.GOOGLE_CLIENT_ID)
console.log("These are the env credentials ", process.env.GOOGLE_CLIENT_SECRET)
console.log("Hey there")

export const authOptions: NextAuthOptions = {

  providers: [
    CredentialsProvider({
        name: 'Credentials',
        credentials: {
          username: { label: 'email', type: 'text', placeholder: '' },
          password: { label: 'password', type: 'password', placeholder: '' },
        },
        async authorize(credentials: any) {
            console.log("credentials ", credentials)
            return {
                id: "user1",
                name: "Prateek Gupta",
                email: "prateek@example.com" // Add email if you want it in session
            };
        },
      }),
    GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET|| ""
  })

  ],
  callbacks:{
    jwt:({token, user, profile}) => {
        console.log("token ", token)
        console.log("user ", user)
        console.log("profile  ", profile)
        return token;
    },
    session: ({ session, token, user }:any) => {
        console.log("session ", session)
        return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET, // Make sure you have this in .env.local
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }







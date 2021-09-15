import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from '../../../lib/prisma'

export default NextAuth({
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],

  adapter: PrismaAdapter(prisma),
  callbacks: {
    session: async (session, user:{id:number}) => {
      session.id = user.id
      return Promise.resolve(session)
    },
  },
})
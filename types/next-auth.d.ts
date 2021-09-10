import NextAuth from "next-auth"
import { StringDecoder } from "string_decoder";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      name: string
      email: string
      image: string
    }
    id: number
    accessToken: string
  }
}
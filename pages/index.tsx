import Layout from '../components/Layout'
import { signIn, signOut, useSession } from "next-auth/client"
import { useState } from 'react'


export default function IndexPage() {
  const [session, loading] = useSession()

  if (loading) return (
    <div>loading</div>
  )

  if (session) return (
    <Layout>logged in as {session.user.name}
      <button onClick={() => signOut()}>Sign out</button>
    </Layout>

  )

  return (
    <Layout>
      <h1>
        landing
      </h1>
      <button
        onClick={() =>
          signIn("google", { callbackUrl: process.env.NEXT_PUBLIC_URL+"/dashboard/" })
        }
      > Sign in
      </button>
    </Layout>
  )
}


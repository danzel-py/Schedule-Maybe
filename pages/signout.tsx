import Layout from '../components/Layout'
import { getSession } from 'next-auth/client'
import { signIn, signOut, useSession } from "next-auth/client"
import { useEffect } from 'react'
import {  useRouter } from 'next/router'


export async function getServerSideProps(context) {
  const session = await getSession(context)
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  return {
    props:
    {session}
  }
}

export default function Logout({session}) {
  return(
    <Layout>logged in as {session.user.name}
      <button 
      onClick={() => signOut()} 
      className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
      >
        Sign out
      </button>

    </Layout>
  )
}


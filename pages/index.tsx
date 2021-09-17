import Layout from '../components/Layout'
import { signIn, signOut, useSession } from "next-auth/client"
import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'


export default function IndexPage() {
  const [session, loading] = useSession()
  const router = useRouter()

  if (loading) return (
    <div>loading</div>
  )

  return (
    <Layout>
      <Head>
      <meta name="google-site-verification" content="nrJ2urtaStsY3IoUvUq5QiodaQCP_k_toubGOApy82k" />
      </Head>
      <div className="sm:h-64 h-screen bg-red-100 flex sm:flex-row flex-col justify-center items-center sm:gap-x-8 gap-y-8">


        <img src="https://i.ibb.co/prg0xz6/Drawing-1-sketchpad.png" alt="placeholder-logo-1" className="h-24" />

        <div className="sm:h-3/4 w-3/4 h-px sm:w-px none sm:block bg-gray-600"></div>

        <div>
          <h1 className='text-2xl mb-2'>
            Welcome
          </h1>
          {session?
          <button
          onClick={()=>{router.push('/dashboard')}}
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          >
            Go to Dashboard
          </button>
          :
          <button
          onClick={() =>
            signIn("google", { callbackUrl: process.env.NEXT_PUBLIC_URL + "/dashboard/" })
          }
          className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
          
          > Sign in w/google
      </button>
        }
        </div>
      </div>
      <div>
        Need:
        <ul>
          <li>Feedback</li>
          <li>UI UX ers</li>
        </ul>
      </div>
    </Layout>
  )
}


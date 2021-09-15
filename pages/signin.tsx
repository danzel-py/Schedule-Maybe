import Layout from '../components/Layout'
import { signIn, signOut, useSession } from "next-auth/client"
import { useRouter } from 'next/router'


export default function Login() {
  const [session,loading] = useSession()
  const router = useRouter()

  if(loading){
    return(
      <Layout>
        loading...
      </Layout>
    )
  }
  if(session){
    router.push('/')
  }
  return (
    <Layout>
      <h1>
        you're not logged in
      </h1>
      <button 
      onClick={() =>
        signIn("google", { callbackUrl: process.env.NEXT_PUBLIC_URL+"/dashboard/" })
      }
      className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
      >
        Sign in w/google
      </button>
    </Layout>
  )
}


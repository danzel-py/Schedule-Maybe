import { useSession } from 'next-auth/client'
import { useEffect } from 'react'
import Layout from '../components/Layout'
import useSWR from 'swr'
import { fetcher } from '../helpers/fetcher'
import { useRouter } from 'next/router'

export default function Profile() {
  const router = useRouter()
  const [session, loading] = useSession()
  const { isValidating, data, error, mutate } = useSWR(`/api/users/get/user`, fetcher)


  useEffect(() => {
    console.log(data)
  }, [data])

  if(isValidating || loading){
    return (<div>Loading...</div>)
  }

  if(!session){
    router.push('/')
    return (<div>redirecting...</div>)
  }

  return (
    <Layout>
      <div className="flex flex-wrap justify-center">
        <div className="w-6/12 sm:w-4/12 px-4">
      <img src={data.user.image} alt="your profile picture" className="shadow-lg rounded-full max-w-full h-auto align-middle border-none" />
        </div>
      </div>

      <h1>
        {data.user.name}
      </h1>
        {data.user.email}
    </Layout>
  )
}
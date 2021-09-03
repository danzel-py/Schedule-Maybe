import Link from 'next/link'
import { useRouter } from 'next/dist/client/router'
import Layout from '../../components/Layout'
import useSWR from 'swr'
import { useState } from 'react'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function GroupPage() {
  const router = useRouter()
  const { groupName } = router.query
  const [message, setMessage] = useState<string>('')
  const [success, setSuccess] = useState<boolean>(false)

  const { data, error } = useSWR(`/api/groups/get/${groupName}`, fetcher)


  const handlePurge = async () =>{
    const res = await fetch(`/api/groups/purge/${groupName}`,{
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      }
    }).then((r) => r.json())

    setMessage(res.message)
    if(res.success){
      setSuccess(true)
    }
    /*
    * res.message
    * res.success
    */
  }

  if (error) return <div>{error}</div>
  if (!data) return <div>loading...</div>
  if (message) return (
    <div>
      {success && <>
        Deleted, </>}
      {message}
    </div>
  )
  if (data.groupNotFound) return (
    <div>
      group not found<br />
      <Link href='/g/create'>
        <a>
          Create a new group
      </a>
      </Link>
      <br />
      <Link href='/g/join'>
        <a>
          Join existing
      </a>
      </Link>
    </div>
  )



  return (
    <Layout>
      <h1>
        Welcome to {data.groupData?.name}
      </h1>

      {data.groupData?.admin && <>Youre an admin
      <div>
      <button className="h-10 px-5 m-2 text-red-100 transition-colors duration-150 bg-red-700 rounded-lg focus:shadow-outline hover:bg-red-800" onClick={handlePurge}>Purge group</button>

      </div>
      </>}

    </Layout>
  )
}


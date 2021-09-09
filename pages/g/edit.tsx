import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useSession } from "next-auth/client"
import useSWR from 'swr'
import Layout from '../../components/Layout'
import { fetcher } from '../../helpers/fetcher'
import { useState, useEffect } from 'react'

export default function EditGroup() {
  const [session, loading] = useSession()
  const [message, setMessage] = useState<string>('')
  const [success, setSuccess] = useState<boolean>(false)
  const [showPurge, setShowPurge] = useState<boolean>(false)
  const { register, formState: { errors }, handleSubmit } = useForm<FormData>()
  const router = useRouter()
  const { isValidating, data, error, mutate } = useSWR(`/api/groups/get/${router.query.groupName}`, fetcher)



  const [purgeConfirmation, setPurgeConfirmation] = useState<boolean>(false)
  const handlePurge = async () => {
    const res = await fetch(`/api/groups/purge/${router.query.groupName}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      }
    }).then((r) => r.json())

    setMessage(res.message)
    if (res.success) {
      setSuccess(true)
      setTimeout(() => {
        router.push('/groups')
      }, 2000)
    }
    /*
    * res.message
    * res.success
    */
  }

  if(!data){
    return(
      <Layout>
        Loading
      </Layout>
    )
  }

  return (
    

    <Layout>
      <button onClick={()=>console.log(data)}>ho</button>
      {showPurge &&
        <div className="mx-auto sm:w-3/4 md:w-2/4 fixed inset-x-0 top-10">
          <div className="bg-blue-200 px-6 py-4 my-4 rounded-md text-sm md:text-base flex justify-between items-center w-full">
            <div>Permanently delete group?</div>
            <div className="w-36 grid grid-cols-2 divide-x-2">
              <button onClick={handlePurge} className='text-red-500'>delete</button>
              <button onClick={() => setPurgeConfirmation(false)} className='text-gray-500'>cancel</button>
            </div>
          </div>
        </div>
      }
    </Layout>
  )
}
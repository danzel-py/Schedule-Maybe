import Link from 'next/link'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import Layout from '../../components/Layout'
import useSWR from 'swr'
import { useEffect, useState } from 'react'
import ScheduleForm from '../../components/Forms/ScheduleForm'
import { useSession } from "next-auth/client"
import ScheduleList from '../../components/Schedules/ScheduleList'



const fetcher = (url) => fetch(url).then((res) => res.json())

export default function GroupPage() {
  const [session, loading] = useSession()
  const router = useRouter()
  const { groupName } = router.query
  const { isValidating, data, error, mutate } = useSWR(`/api/groups/get/${groupName}`, fetcher)


  const [message, setMessage] = useState<string>('')
  const [success, setSuccess] = useState<boolean>(false)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [formPlaceholders, setFormPlaceholders] = useState<object>({ edit: false })

  const { register, formState: { errors }, handleSubmit } = useForm<FormData>()

  const handleSetShowForm = (edit: boolean = false, placeholders?: Object) => {
    if (edit) {
      setShowForm(true)
      setFormPlaceholders(placeholders)
    } else {
      setFormPlaceholders({ edit: false })
      setShowForm(!showForm)
    }
  }

  const handleRefreshData = () =>{
    mutate()
  }

  const handlePurge = async () => {
    const res = await fetch(`/api/groups/purge/${groupName}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      }
    }).then((r) => r.json())

    setMessage(res.message)
    if (res.success) {
      setSuccess(true)
    }
    /*
    * res.message
    * res.success
    */
  }

  useEffect(() => {
    if (!session && !loading) {
      router.push('/')
    }
  }, [session])

  useEffect(()=>{
    if(showForm){
      document.body.style.overflow = 'hidden'
    }else{
      document.body.style.overflow = 'unset'
    }
  },[showForm])

  if (error) return <div>{error}</div>
  if (!data) return <div>loading...</div>
  if (message) return (
    <Layout>
      {success && <>
        Group Deleted, </>}
      {message}
    </Layout>
  )
  if (data.groupNotFound) return (
    <Layout>
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
    </Layout>
  )



  return (
    <Layout>
      <h1>
        Welcome to {data.groupData?.name}
      </h1>
      <button onClick={() => mutate()}>refresh</button>
      {isValidating && <div>
        Data is being refreshed
      </div>}
      {data.groupData?.admin && <>Youre an admin
        <div>
          <button className="h-10 px-5 m-2 text-red-100 transition-colors duration-150 bg-red-700 rounded-lg focus:shadow-outline hover:bg-red-800" onClick={handlePurge}>Purge group</button>

        </div>
      </>}

      {data.groupData.member && <>Youre a member {data.groupData.member}</>}

      {(data.groupData.member || data.groupData.admin) &&
        <div>
          Member/admin only <br></br>
          <ScheduleList schedules={data.groupData.schedules} session={session} groupName={groupName} setShowForm={handleSetShowForm} />


          <button onClick={() => setShowForm(!showForm)} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
            new schedule</button>

        </div>
      }
      <ScheduleForm showForm={showForm} setShowForm={handleSetShowForm} groupName={groupName} placeholders={formPlaceholders} getRefresh={handleRefreshData}/>

    </Layout>
  )
}


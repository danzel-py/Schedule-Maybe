import Layout from '../components/Layout'
import { useSession } from 'next-auth/client'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { fetcher } from '../helpers/fetcher'
import { useRouter } from 'next/router'
import { sortAscending, sortDescending } from '../helpers/sorter'
import ScheduleBoard from '../components/Schedules/ScheduleBoard'

// TODO: Edit&New schedule form here

export default function Dashboard() {
  const router = useRouter()
  const [session, loading] = useSession()
  const { isValidating, data, error, mutate } = useSWR(`/api/users/get/schedules`, fetcher)
  const [scheduleList, setScheduleList] = useState([])

  useEffect(() => {
    if (!session && !loading) {
      router.push('/')
    }
  }, [session])

  useEffect(() => {
    if (data) {
      let newArr = [...data.user.schedulesAuthored, ...data.user.schedulesEnrolled]
      sortAscending(newArr, 'startTime')
      setScheduleList(newArr)
    }
  }, [data])


  if (error) return <div>{error}</div>
  if (!data) return <Layout>loading...</Layout>

  return (
    <Layout>
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl">
          Hi, {data.user.name}.
      </h1>
        <div>
          {isValidating ?
            <button>getting data</button>
            :
            <button 
            className="color-gray-100 hover:color-gray-200"
            onClick={()=>{mutate()}}
            >refresh</button>}
        </div>
      </div>
      <ScheduleBoard mutate={mutate} schedules={scheduleList} session={session} showcase={true} />

    </Layout>
  )
}


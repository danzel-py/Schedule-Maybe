import Layout from '../components/Layout'
import { useSession } from 'next-auth/client'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { fetcher } from '../helpers/fetcher'
import { useRouter } from 'next/router'
import { sortAscending, sortDescending } from '../helpers/sorter'
import ScheduleList from '../components/Schedules/ScheduleList'

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

  useEffect(()=>{
    if(data){
      console.log(data)
      let newArr = [...data.user.schedulesAuthored, ...data.user.schedulesEnrolled]
      sortAscending(newArr, 'startTime')
      setScheduleList(newArr)
    }
  },[data])


  if(!data){
    return (<Layout>
      loading...
    </Layout>)
  }

  return (
    <Layout>
      <h1>
        Hi, {data.user.name}
      </h1>
      upcoming schedules:
      <ScheduleList schedules={scheduleList} session={session} showcase={true} />

    </Layout>
  )
}


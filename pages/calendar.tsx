import Layout from '../components/Layout'
import MonthlyCalendar from '../components/Calendar/MonthlyCalendar'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { session, useSession } from 'next-auth/client'
import { fetcher } from '../helpers/fetcher'
import useSWR from 'swr'


export default function Calendar() {
  const router = useRouter()
  const [session, loading] = useSession()
  const [scheduleList, setScheduleList] = useState<object[]>([])
  const { isValidating, data, error, mutate } = useSWR(`/api/users/get/schedules`, fetcher)


  useEffect(() => {
    if (!session && !loading) {
      router.push('/')
    }
  }, [session])

  useEffect(()=>{
    if(data){
      let newArr = [...data.user.schedulesAuthored, ...data.user.schedulesEnrolled]
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
        caleeeendaaar
      </h1>
      <MonthlyCalendar scheduleList={scheduleList}/>

    </Layout>
  )
}


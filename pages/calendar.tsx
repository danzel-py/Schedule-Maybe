import Layout from '../components/Layout'
import MonthlyCalendar from '../components/Calendar/MonthlyCalendar'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { session, useSession } from 'next-auth/client'
import { fetcher } from '../helpers/fetcher'
import { format, maxTime } from 'date-fns'
import useSWR from 'swr'
import PopupSchedule from '../components/Schedules/PopupSchedule'


// TODO: add weekly calendar
// todo: in schedule list button : create schedule => choose group => show form with prepopulated date (monthly,weekly)

export default function Calendar() {
  const router = useRouter()
  const [session, loading] = useSession()
  const [scheduleList, setScheduleList] = useState<object[]>([])
  const [currentDate, setCurrentDate] = useState<Date>(new Date(maxTime))
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

  const handleSetCurrentDate = (date) =>{
    setCurrentDate(new Date(date))
  }

  if(!data || !session){
    return (<Layout>
      getting data...
    </Layout>)
  }

  return (
    <Layout>
      <h1>
        caleeeendaaar {isValidating && "updating data..."}
      </h1>
      <MonthlyCalendar scheduleList={scheduleList} setCurrentDate = {handleSetCurrentDate}/>
      {/* {format(currentDate,"d y")} */}

      <PopupSchedule mutate={mutate} scheduleList={scheduleList} session={session} currentDate={currentDate} setCurrentDate={handleSetCurrentDate}/>

    </Layout>
  )
}


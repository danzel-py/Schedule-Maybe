import Layout from '../components/Layout'
import MonthlyCalendar from '../components/Calendar/MonthlyCalendar'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { session, useSession } from 'next-auth/client'
import { fetcher } from '../helpers/fetcher'
import { format, maxTime } from 'date-fns'
import useSWR from 'swr'
import PopupSchedule from '../components/Schedules/PopupSchedule'
import ScheduleForm from '../components/Forms/ScheduleForm'


// TODO: add weekly calendar
// todo: in schedule list button : create schedule => choose group => show form with prepopulated date (monthly,weekly)

export default function Calendar() {
  const router = useRouter()
  const [session, loading] = useSession()
  const [scheduleList, setScheduleList] = useState<object[]>([])
  const [currentDate, setCurrentDate] = useState<Date>(new Date(maxTime))
  const { isValidating, data, error, mutate } = useSWR(`/api/users/get/schedules`, fetcher)


  // Form stuffs
  const [showForm, setShowForm] = useState<boolean>(false)
  const [formPlaceholders, setFormPlaceholders] = useState<object>({edit:false})
  const handleSetShowForm = (edit: boolean = false, placeholders?: Object) => {
    if (edit) {
      setShowForm(true)
      setFormPlaceholders(placeholders)
    } else {
      setFormPlaceholders({ edit: false })
      setShowForm(!showForm)
    }
  }
  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [showForm])


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

      <PopupSchedule mutate={mutate} scheduleList={scheduleList} session={session} currentDate={currentDate} setCurrentDate={handleSetCurrentDate} setShowForm={handleSetShowForm}/>
      <ScheduleForm
        showForm={showForm} setShowForm={handleSetShowForm} placeholders={formPlaceholders}
        getRefresh={mutate}
      />
    </Layout>
  )
}


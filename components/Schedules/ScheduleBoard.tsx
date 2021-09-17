import { useEffect, useState } from "react"
import {
  isToday,
  isBefore,
  isAfter,
  isSameWeek,
  isSameMonth,
  format,
  startOfToday,
  addDays,
  parseISO
} from 'date-fns'
import ScheduleBoardList from "./ScheduleBoardList"

// todo: handle delete/unenroll schedule

export default function ScheduleList(props) {
  const [handlingRequest, setHandlingRequest] = useState<boolean>(false)
  const [requestSuccess, setRequestSuccess] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')

  const handlingRequestHandler = (param: boolean) => {
    setHandlingRequest(param)
  }
  const requestSuccessHandler = (param: boolean) => {
    setRequestSuccess(param)
  }

  const messageHandler = (param: string) => {
    setMessage(param)
  }

  const [propsData, setPropsData] = useState(props)
  const [todaySchedule, setTodaySchedule] = useState([])
  const [weekSchedule, setWeekSchedule] = useState([])
  const [monthSchedule, setMonthSchedule] = useState([])
  const [pastSchedule, setPastSchedule] = useState([])
  const [futureSchedule, setFutureSchedule] = useState([])
  const [board, setBoard] = useState([])
  const [boardNum, setBoardNum] = useState(0)
  let currentRender = ''
  let shouldSayDate = true
  let colorSwitch = true

  const asideData = [
    {
      text: "Today",
      id: 0
    },
    {
      text: "Due in 7 days",
      id: 1
    },
    {
      text: "Due in 30 days",
      id: 2
    },
    {
      text: "All Upcoming",
      id: 3
    },
    {
      text: "Past",
      id: 4
    },
    {
      text: "Show All",
      id: 5
    }
  ]

  useEffect(() => {
    setPropsData(props)
  }, [props])

  useEffect(() => {
    let today = []
    let week = []
    let month = []
    let past = []
    let future = []
    propsData.schedules.forEach((schedule) => {
      let startTimeISO = parseISO(schedule.startTime)
      if (isBefore(startTimeISO, startOfToday())) {
        past.unshift(schedule)
      } else {
        future.push(schedule)
        if (isToday(startTimeISO)) {
          today.push(schedule)
        }
        if (isBefore(startTimeISO, addDays(startOfToday(), 7))) {
          week.push(schedule)
        }
        if (isBefore(startTimeISO, addDays(startOfToday(), 30))) {
          month.push(schedule)
        }
      }

    })
    setTodaySchedule(today)
    setWeekSchedule(week)
    setMonthSchedule(month)
    setPastSchedule(past)
    setFutureSchedule(future)
    setBoard(today)
  }, [propsData.schedules])

  useEffect(() => {
    if (boardNum == 0) {
      setBoard(todaySchedule)
    } else if (boardNum == 1) {
      setBoard(weekSchedule)
    } else if (boardNum == 2) {
      setBoard(monthSchedule)
    } else if (boardNum == 3) {
      setBoard(futureSchedule)
    } else if (boardNum == 4) {
      setBoard(pastSchedule)
    } else if (boardNum == 5) {
      setBoard(propsData.schedules)
    }
  }, [boardNum])

  const getCount = (param: number) => {
    if (param == 0) {
      return todaySchedule.length;
    }
    else if (param == 1) {
      return weekSchedule.length;
    }
    else if (param == 2) {
      return monthSchedule.length;

    }
    else if (param == 3) {
      return futureSchedule.length;

    }
    else {
      return 0;
    }
  }
  const handleUnenrollSchedule = async (id) => {
    setHandlingRequest(true)
    setMessage('')
    setRequestSuccess(false)
    const res = await fetch(`/api/schedules/unenroll`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        id
      })
    })
      .then(r => r.json())
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setHandlingRequest(false)
      })
    if (res?.message) {
      setMessage(res.message)
    }
    if (res?.success) {
      setRequestSuccess(true)
      setMessage('')
      setTimeout(() => {
        props.mutate();
      }, 1000)
    }

  }

  const handleDeleteSchedule = async (id) => {
    setHandlingRequest(true)
    setMessage('')
    setRequestSuccess(false)
    const res = await fetch(`/api/schedules/purge`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        id
      })
    })
      .then(r => r.json())
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setHandlingRequest(false)
      })
    if (res?.message) {
      setMessage(res.message)
    }
    if (res?.success) {
      setRequestSuccess(true)
      setMessage('')
      setTimeout(() => {
        props.mutate();
      }, 1000)
    }

  }


  return (
    <div className="container mx-auto">
      <div className="flex flex-row flex-wrap py-4">
        <aside className="w-full sm:w-1/3 md:w-1/4 px-2">
          <div className="sticky top-0 p-4 w-full">
            {/* !NAV */}
            <ul className="flex flex-col gap-y-2 overflow-hidden">
              {
                asideData.map((a) => {
                  return (

                    <li
                      className={`flex flex-row justify-between ${a.id == boardNum ? "bg-gray-400" : "bg-gray-100 hover:bg-gray-200"} `}
                      key={a.id}
                      onClick={() => setBoardNum(a.id)}
                    >
                      <p>
                        {a.text}
                      </p>
                      <p className="text-gray-500">
                        {getCount(a.id) ? getCount(a.id) : ""}
                      </p>

                    </li>
                  )
                })
              }
            </ul>
          </div>
        </aside>


        <main role="main" className="w-full sm:w-2/3 md:w-3/4 pt-1 px-2">
          {requestSuccess && "Success."}
          {message && message}
          <ScheduleBoardList board={board} session={props.session} mutate={props.mutate} setHandlingRequest={handlingRequestHandler} setMessage={messageHandler} setRequestSuccess={requestSuccessHandler} />

        </main>
      </div>
    </div >
  )
}
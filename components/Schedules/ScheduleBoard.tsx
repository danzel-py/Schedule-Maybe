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
import { parse } from "path/posix"

// todo: handle delete/unenroll schedule

export default function ScheduleList(props) {
  const [handlingRequest, setHandlingRequest] = useState<boolean>(false)
  const [requestSuccess, setRequestSuccess] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
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
        past.push(schedule)
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
    }

  }


  return (
    <div className="container mx-auto">
      <div className="flex flex-row flex-wrap py-4">
        <aside className="w-full sm:w-1/3 md:w-1/4 px-2">
          <div className="sticky top-0 p-4 w-full">
            {/* <!-- navigation --> */}
            <ul className="flex flex-col gap-y-2 overflow-hidden">
              {
                asideData.map((a) => {
                  return (

                    <li
                      className={`${a.id == boardNum? "bg-gray-400":"bg-gray-100 hover:bg-gray-200"} `}
                      key={a.id}
                      onClick={() => setBoardNum(a.id)}
                    >
                      {a.text}
                    </li>
                  )
                })
              }
            </ul>
          </div>
        </aside>
        <main role="main" className="w-full sm:w-2/3 md:w-3/4 pt-1 px-2">
          <ul className='flex flex-col '>
            {
              board.map((e, i) => {
                if (format(parseISO(e.startTime), "eee d MMM yy") != currentRender) {
                  currentRender = format(parseISO(e.startTime), "eee d MMM yy")
                  shouldSayDate = true
                  colorSwitch = !colorSwitch
                } else {
                  shouldSayDate = false
                }
                return (
                  <li key={i}
                    className={`${colorSwitch ? "bg-gray-100 " : ""} p-2`}
                  >
                    {shouldSayDate &&
                      <div
                        className="mb-2 text-center"
                      >
                        {format(parseISO(e.startTime), "eee d MMM yy")}
                      </div>
                    }
                    <div
                    >
                      <div className="flex flex-row justify-between">
                        <div className='text-lg'>
                          {format(parseISO(e.startTime), "kk:mm")}
                          {"-"}
                          {format(parseISO(e.endTime), "kk:mm")}
                        </div>
                        <div className="text-sm">
                          {e.type}
                        </div>
                      </div>
                      <div className="flex flex-row ml-2 justify-between">
                        <div className="text-xl">
                          {e.name}
                        </div>
                        <button className="text-xs text-gray-400">
                          {props.session.id == e.authorId ? "delete" : "unenroll"}
                        </button>
                      </div>
                      <div className='text-sm ml-2'>
                        {e.description}
                        {e.link &&
                          <a href={e.link} target="_blank">
                            <p className='w-full truncate text-blue-500 mt-2'>
                              {e.link}
                            </p>
                          </a>
                        }
                      </div>
                    </div>
                  </li>
                )
              })
            }
          </ul>
        </main>
      </div>
    </div>
  )
}
import { useState, useEffect } from 'react'
import {
  format,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isSameDay,
  addDays,
  parse
} from 'date-fns'
import MonthlyCells from './MonthlyCells'

export default function MonthlyCalendar(props) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [currentDate, setCurrentDate] = useState<Date>()
  const [scheduleList, setScheduleList] = useState<object[]>([])
  const nxMonthYearFormat = "MMMM yyyy"
  const nxDayFormat = "eee"


  useEffect(()=>{
    setScheduleList(props.scheduleList)
  },[props.scheduleList])

  const renderDays = () => {
    const days = []

    let startDate = startOfWeek(currentMonth)

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="w-32 h-10" key={i}>
          {format(addDays(startDate, i), nxDayFormat)}
        </div>
      )
    }

    return <div className="flex flex-row justify-center flex-nowrap gap-x-2">{days}</div>;
  }

  const showDetail = () => {
    
  }


  const handleSetCurrentDate = (date) => {
    setCurrentDate(new Date(date))
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  return (
      <div className="flex flex-col w-full justify-center ">
        <div className="flex text-center items-center justify-center flex-row flex-nowrap gap-x-6 h-20">
          <div className="w-64" onClick={prevMonth}>
            <div className="bg-gray-100 hover:bg-gray-200">
              {"<"}
            </div>
          </div>
          <div className="w-96">
            <span>{format(currentMonth, nxMonthYearFormat)}</span>
          </div>
          <div className="w-64" onClick={nextMonth}>
            <div className="bg-gray-100 hover:bg-gray-200">
              {">"}
            </div>
          </div>
        </div>

        {renderDays()}
        <MonthlyCells setCurrentDate={handleSetCurrentDate} currentMonth={currentMonth} currentDate={currentDate} scheduleList={scheduleList} />

        {/* {format(currentDate, "eee d MMM yy")} */}


      </div>
  )
}
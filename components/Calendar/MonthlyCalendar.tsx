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

export default function MonthlyCalendar() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const nxMonthYearFormat = "MMMM yyyy"
  const nxDayFormat = "eee"


  const renderDays = () => {
    const days = []

    let startDate = startOfWeek(currentMonth)

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="" key={i}>
          {format(addDays(startDate, i), nxDayFormat)}
        </div>
      )
    }

    return <div className="flex flex-row flex-nowrap gap-x-1">{days}</div>;
  }



  const handleSetCurrentDate = (date) => {
    console.log(date)
    setCurrentDate(new Date(date))
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  return (
    <div>
      <div className="flex flex-row flex-nowrap gap-x-2 h-10">
        <div className="w-64"  onClick={prevMonth}>
          <div className="icon">
            {"<"}
          </div>
        </div>
        <div className="w-96">
          <span>{format(currentMonth, nxMonthYearFormat)}</span>
        </div>
        <div className="w-64" onClick={nextMonth}>
          <div className="icon">
            {">"}
          </div>
        </div>
      </div>

      {renderDays()}
      <MonthlyCells setCurrentDate={handleSetCurrentDate} currentMonth={currentMonth} currentDate={currentDate} />
      {format(currentDate, "eee d MMM yy")}


    </div>
  )
}
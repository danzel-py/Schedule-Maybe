import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isSameDay,
  addDays,
  isToday,
  isAfter,
  isBefore,
  parseISO
} from 'date-fns'
import { watchFile } from 'fs';
import { useEffect, useState } from 'react';
import {sortAscending} from '../../helpers/sorter'

export default function renderCells(props) {
  const [monthStart, setMonthStart] = useState(startOfMonth(props.currentMonth))
  const [monthEnd, setMonthEnd] = useState(endOfMonth(props.currentMonth))
  const [startDate, setStartDate] = useState(startOfWeek(monthStart))
  const [endDate, setEndDate] = useState(endOfWeek(monthEnd))
  const [scheduleList, setScheduleList] = useState([])

  useEffect(() => {
    let newArr = props.scheduleList.filter(schedule => isAfter(parseISO(schedule.startTime), startDate) && isBefore(parseISO(schedule.startTime), endDate))
    sortAscending(newArr,'startTime')
    setScheduleList(newArr)
  }, [props.scheduleList])

  useEffect(() => {
    setMonthStart(startOfMonth(props.currentMonth))
    setMonthEnd(endOfMonth(props.currentMonth))
  }, [props.currentMonth])

  useEffect(() => {
    setStartDate(startOfWeek(monthStart))
    setEndDate(endOfWeek(monthEnd))
    day = startDate
  }, [monthEnd])


  const renderSchedule = (paramDay)=>{
    let dailySchedule = scheduleList.filter(sch=>isSameDay(paramDay, parseISO(sch.startTime)))
    
    return(<ul>
      {dailySchedule.map((e,i)=>{
        return(

          <li className="" key={i}>
          {e.type}
        </li>
          )
      })}
    </ul>)

  }


  let dateNum = "";
  const dateFormat = "d";
  let rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      let dayv2 = day
      dateNum = format(day, dateFormat);
      days.push(
        <div
          className={`w-32 h-20 overflow-clip
          ${!isSameMonth(day, monthStart)
              ?
              isSameDay(day, props.currentDate) ? "bg-gray-400" : "bg-gray-100"
              : isSameDay(day, props.currentDate) ? "bg-blue-400" : "bg-blue-100"
            }`}
          key={dateNum + rows.length + i}
          onClick={() => props.setCurrentDate(dayv2)}
        >
          <span className={`${isToday(day) && "text-blue-800 border-solid border-4 rounded-full border-blue-500"}`}>{dateNum}</span>
          {renderSchedule(dayv2)}
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="flex flex-row justify-center gap-x-2" key={dateNum + "7" + rows.length}>
        {days}
      </div>
    );
    days = [];
  }
  if (!rows) {
    return <div></div>
  }
  return <div className="flex flex-col gap-y-2">{rows}</div>;
}
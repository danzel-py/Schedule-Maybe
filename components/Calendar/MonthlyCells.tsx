import { 
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isSameDay,
  addDays,
} from 'date-fns'
import { useEffect, useState } from 'react';

// ! BUG first week not unmounting when going to jan from feb

export default function renderCells (props){
  const [monthStart, setMonthStart] = useState(startOfMonth(props.currentMonth))
  const [monthEnd, setMonthEnd] = useState(endOfMonth(props.currentMonth))
  const [startDate, setStartDate] = useState(startOfWeek(monthStart))
  const [endDate, setEndDate] = useState(endOfWeek(monthEnd))

  const dateFormat = "d";
  let rows = [];
  let days = [];
  let day = startDate;
  
  useEffect(()=>{
    setMonthStart(startOfMonth(props.currentMonth))
    setMonthEnd(endOfMonth(props.currentMonth))
  },[props.currentMonth])
  
  useEffect(()=>{
    console.log(startOfWeek(monthStart))
    console.log(endOfWeek(monthEnd))
    console.log(days)
    setStartDate(startOfWeek(monthStart))
    setEndDate(endOfWeek(monthEnd))
    day = startDate
  },[monthEnd])

  useEffect(()=>{
    console.log(rows)
  },[rows])
  
  let dateNum = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      let dayv2 = day
      dateNum = format(day, dateFormat);
      days.push(
        <div
          className={`w-32 h-20 ${
            !isSameMonth(day, monthStart)
            ?
            isSameDay(day, props.currentDate) ? "bg-gray-400" : "bg-gray-100"
            : isSameDay(day, props.currentDate) ? "bg-blue-400" : "bg-blue-100"
          }`}
          key={dateNum}
          onClick={() => props.setCurrentDate(dayv2)}
        >
          <span className="number">{dateNum}</span>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="flex flex-row gap-x-2" key={dateNum+7}>
        {days}
      </div>
    );
    days = [];
  }
  return <div className="flex flex-col gap-y-2">{rows}</div>;
}
import { useState } from "react"

export default function ScheduleList(props) {

  const [handlingRequest, setHandlingRequest] = useState<boolean>(false)
  const [requestSuccess, setRequestSuccess] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')

  const handleDeleteSchedule = async (id) =>{
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
      .finally(()=>{
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
    <div>
      {message && <>{message}</>}
      {handlingRequest && <>Loading...</>}
      {requestSuccess && <>delete OK</>}
      <ul>

        {props.schedules.map((schedule) => {
          return (
            <li key={schedule.id}>
              {schedule.name}
              {" | "}
              {schedule.description}
              {" | "}
              {schedule.startTime}
              {" | "}
              {schedule.endTime}
              <button onClick={()=>handleDeleteSchedule(schedule.id)}>
                DELete
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
import { useEffect, useState } from "react"
import { getDateFromObject, getTimeFromObject } from "../../helpers/datetime"

export default function ScheduleList(props) {
  const [handlingRequest, setHandlingRequest] = useState<boolean>(false)
  const [requestSuccess, setRequestSuccess] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [propsData, setPropsData] = useState(props)
  useEffect(() => {
    setPropsData(props)
  }, [props])

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
    <div>
      {message && <>{message}</>}
      {handlingRequest && <>Loading...</>}
      {requestSuccess && <>delete OK</>}

        <ul>
          {propsData.schedules.map((schedule) => {
            return (
              <li key={schedule.id}>
                {schedule.name}
                {" | "}
                {schedule.description}
                {" | "}
                {schedule.startTime}
                {" | "}
                {schedule.endTime}
                {(!propsData.showcase &&
                  (
                    propsData.session.id == schedule.authorId
                    || propsData.groupAuthorId == propsData.session.id)
                )
                  &&
                  <div>
                    <button onClick={() => handleDeleteSchedule(schedule.id)}>
                      DELete
              </button>
                    {" | "}
                    <button onClick={() => propsData.setShowForm(true, {
                      name: schedule.name,
                      description: schedule.description,
                      startTime: getTimeFromObject(schedule.startTime),
                      endTime: getTimeFromObject(schedule.endTime),
                      date: getDateFromObject(schedule.startTime),
                      link: schedule.link,
                      type: schedule.type,
                      id: schedule.id,
                      edit: true
                    })} >
                      edit</button>
                  </div>
                }
              </li>
            )
          })}
        </ul>
    </div>
  )
}
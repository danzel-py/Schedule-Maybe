import { format, parseISO } from 'date-fns'
import { getDateFromObject, getTimeFromObject } from "../../helpers/datetime"



/**
 * Schedule List for the board in dashboard
 * @param {object[]} board - list of schedules
 * @param session
 * @param mutate
 * @param setHandlingRequest
 * @param setMessage
 * @param setRequestSuccess
 * @param setShowForm
 * @returns an ul with lis
 * @example <ScheduleBoardList 
 * setShowForm={handleSetShowForm} (important) (see ScheduleBoard)
 * board={board} 
 * session={props.session}
 * mutate={props.mutate}
 * setHandlingRequest={handlingRequestHandler} 
 * setMessage={messageHandler} 
 * setRequestSuccess={requestSuccessHandler} />
 */
export default function ScheduleBoardList(props) {
  let currentRender = ''
  let shouldSayDate = true
  let colorSwitch = true

  const handleUnenrollSchedule = async (id, enroll=false) => {
    props.setHandlingRequest(true)
    props.setMessage('')
    props.setRequestSuccess(false)
    const res = await fetch(`/api/schedules/${enroll? "enroll":"unenroll"}`, {
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
        props.setHandlingRequest(false)
      })
    if (res?.message) {
      props.setMessage(res.message)
    }
    if (res?.success) {
      props.setRequestSuccess(true)
      props.setMessage('')
      setTimeout(() => {
        props.mutate();
      }, 1000)
      setTimeout(() => {
        props.setRequestSuccess(false)
      }, 2000)
    }

  }

  const handleDeleteSchedule = async (id) => {
    props.setHandlingRequest(true)
    props.setMessage('')
    props.setRequestSuccess(false)
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
        props.setHandlingRequest(false)
      })
    if (res?.message) {
      props.setMessage(res.message)
    }
    if (res?.success) {
      props.setRequestSuccess(true)
      props.setMessage('')
      setTimeout(() => {
        props.mutate();
      }, 1000)
    }

  }
  return (
    <ul className='flex flex-col '>
      {
        props.board.map((e, i) => {
          if (format(parseISO(e.startTime), "eee d MMM yy") != currentRender) {
            currentRender = format(parseISO(e.startTime), "eee d MMM yy")
            shouldSayDate = true
            colorSwitch = !colorSwitch
          } else {
            shouldSayDate = false
          }
          return (
            <li key={e.id}
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
                  {props.session.id == e.authorId ?
                    <div className="flex flex-row">
                      <button className="text-xs text-gray-400" 
                      onClick={() => props.setShowForm(true, {
                        name: e.name,
                        description: e.description,
                        startTime: getTimeFromObject(e.startTime),
                        endTime: getTimeFromObject(e.endTime),
                        date: getDateFromObject(e.startTime),
                        link: e.link,
                        type: e.type,
                        id: e.id,
                        edit: true,
                        portable: true
                      })}
                      >
                        edit
                      </button>
                      <div className="w-2"></div>
                      <button className="text-xs text-gray-400" onClick={() => handleDeleteSchedule(e.id)}>
                        delete
                      </button>
                    </div>
                    :e.users?.find((user)=>user.id == props.session.id)?
                      <button className="text-xs text-gray-400" onClick={() => handleUnenrollSchedule(e.id)}>
                      unenroll
                      </button>
                      :
                      <button className="text-xs text-gray-400" onClick={() => handleUnenrollSchedule(e.id, true)}>
                      enroll
                      </button>
                      
                    
                  }
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
  )
}
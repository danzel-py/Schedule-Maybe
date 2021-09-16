import { useEffect, useState } from 'react'
import { maxTime, format, isSameDay, parseISO } from 'date-fns'
import ClickAwayListener from 'react-click-away-listener'
import { sortAscending } from '../../helpers/sorter'

// todo?: add schedule here maybe
// todo: on success mutate

export default function PopupSchedule(props) {
  const [handlingRequest, setHandlingRequest] = useState<boolean>(false)
  const [requestSuccess, setRequestSuccess] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')


  const deleteOrUnenrollSchedule = async (id:Number, unenroll = false) => {
    setHandlingRequest(true)
    setMessage('')
    setRequestSuccess(false)
    const res = await fetch(`/api/schedules/${unenroll? "unenroll":"purge"}`, {
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
      setTimeout(()=>{
        setRequestSuccess(false)
        props.mutate()
      },1000)
    }
  }


  const renderSchedule = () => {
    let todaySchedule = props.scheduleList.filter(sch => isSameDay(props.currentDate, parseISO(sch.startTime)))

    if (todaySchedule) {
      sortAscending(todaySchedule, 'startTime')
      return (
        <ul className='flex flex-col divide-y gap-y-4'>
          {todaySchedule.map((e, i) => {
            return (
              <li className='' key={i}>
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
                <div className="flex flex-row justify-between">
                  <div className="text-xl">
                    {e.name}
                  </div>
                  <button 
                  className="text-xs text-gray-400"
                  onClick={()=>deleteOrUnenrollSchedule(e.id,props.session.id != e.authorId)}
                  >
                    {props.session.id == e.authorId ? "delete" : "unenroll"}
                  </button>
                </div>
                <div className='text-sm'>
                  {e.description}
                </div>
                {e.link &&
                  <a href={e.link} target="_blank">
                    <p className='w-full truncate text-blue-500 mt-2'>
                      {e.link}
                    </p>
                  </a>
                }

              </li>
            )
          })}
        </ul>
      )
    }

  }

  const handleSetCurrentDate = () => {
    if ('274760' != format(props.currentDate, 'yyy')) {
      props.setCurrentDate(maxTime)
    }
  }

  return (
    <div className={`${props.currentDate && format(props.currentDate, 'yyy') != '275760' ? "overflow-auto" : "hidden"}`}>
      <div className="absolute inset-0 flex justify-center h-full items-center bg-blue-200 bg-opacity-70 antialiased">
        <div className="flex flex-col w-11/12 sm:w-5/6 lg:w-1/2 max-w-md mx-auto rounded-lg border border-gray-300 shadow-xl">
          <ClickAwayListener onClickAway={handleSetCurrentDate}>
            <div className="overflow-auto max-h-90vh rounded-lg">
              <div>
                <div
                  className="flex flex-col divide-y divide-gray-900 justify-items-center p-6 bg-white border-b border-gray-200 rounded-tl-lg rounded-tr-lg"
                >
                  <div className="text-center mb-4">
                    {props.currentDate && format(props.currentDate, 'd MMM yyy')}
                  </div>
                  {renderSchedule()}
                </div>


                <div
                  className="flex flex-row items-center justify-between p-5 bg-white border-t border-gray-200 rounded-bl-lg rounded-br-lg"
                >
                  <button onClick={handleSetCurrentDate} className="font-semibold text-sm text-gray-600">Close</button>

                  {(message && !requestSuccess && !handlingRequest) &&
                  <div className="flex justify-between text-red-50 shadow-inner rounded px-2 bg-red-600">
                    <p className="self-center text-xs italic">{message}</p><strong onClick={() => setMessage('')} className="text-xl align-center cursor-pointer alert-del"
                    >&times;</strong
                    >
                  </div>
                }
                {
                  requestSuccess &&
                  <div className="flex justify-between text-green-50 shadow-inner rounded px-2 bg-green-600">
                    <p className="self-center text-xs italic">"Success!"</p><strong onClick={() => setRequestSuccess(false)} className="text-xl align-center cursor-pointer alert-del"
                    >&times;</strong
                    >
                  </div>
                }
                {
                  handlingRequest &&
                  <div className="flex justify-between text-blue-50 shadow-inner rounded px-2 bg-blue-600">
                    <p className="self-center text-xs italic">"Loading..."</p><strong onClick={() => setRequestSuccess(false)} className="text-xl align-center cursor-pointer alert-del"
                    >&times;</strong
                    >
                  </div>
                }

                  <button 
                  // type="" 
                  // form="" 
                  className="text-sm px-3 py-1 text-white font-semibold bg-blue-500 rounded"
                  >
                    idk

                </button>
                </div>

              </div>
            </div>

          </ClickAwayListener>
        </div>
      </div>

    </div>
  )
}
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { IFormCreateSchedule } from '../../interfaces/interfaces'
import ClickAwayListener from 'react-click-away-listener'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

export default function ScheduleForm(props) {
  const [message, setMessage] = useState<string>('')
  const [handlingRequest, setHandlingRequest] = useState<boolean>(false)
  const [requestSuccess, setRequestSuccess] = useState<boolean>(false)
  const [todayString, setTodayString] = useState<string>('')
  const [propsData, setPropsData] = useState(props)
  const edit = propsData.placeholders.edit
  const placeholders = propsData.placeholders

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Can not be empty')
      .max(30, 'Must not exceed 30 characters'),
    date: Yup.string()
      .required('Must not empty')
      .matches(
        /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/,
        "Date must in yyyy-mm-dd format"
      ),
    startTime: Yup.string()
      .required('Must not empty')
      .matches(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Time must be in HH:MM format"
      ),
    endTime: Yup.string()
      .required('Must not empty')
      .matches(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Time must be in HH:MM format"
      ),
    link: Yup.string()
      .matches(
        /^$|(((https?:\/\/)|(www\.)|(.+\.))[^\s]+)/,
        'Bad url value'
      )
      .nullable()
  })

  
  const { register, formState: { errors }, handleSubmit, reset } = useForm<IFormCreateSchedule>({
    resolver: yupResolver(validationSchema)
  })


  useEffect(()=>{
    setPropsData(props)
  },[props])
  
  useEffect(()=>{
    // :) react-hook-form moment
    let formDefaultValues = {
      name: placeholders.name,
      date: placeholders.date,
      startTime: placeholders.startTime,
      endTime: placeholders.endTime,
      description: placeholders.description,
      link: placeholders.link
  
    }
    if(placeholders){
      reset(formDefaultValues)
    }

  },[reset,placeholders])

  useEffect(() => {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear().toString();
    if (dd < 10) {
      var dday = '0' + dd.toString()
    } else {
      var dday = dd.toString()
    }
    if (mm < 10) {
      var mmonth = '0' + mm.toString()
    }

    setTodayString(yyyy + '-' + mmonth + '-' + dday)
  }, [])

  useEffect(() => {
    if (!propsData.showForm) {
      reset()
    }
  }, [propsData.showForm])




  const handleNewSchedule = async (formData: IFormCreateSchedule) => {
    console.log(formData)
    setMessage('')
    if (formData.startTime > formData.endTime) {
      return setMessage("Invalid end time")
    }
    if(edit){
      if(
          formData.name == placeholders.name
      &&  formData.description == placeholders.description
      &&  formData.date == placeholders.date
      &&  formData.startTime == placeholders.startTime
      &&  formData.endTime == placeholders.endTime
      &&  formData.link == placeholders.link
      ){
        console.log("sama smua")
        return setMessage("Nothing to update")
      }
    }
    setHandlingRequest(true)
    const res = await fetch(`/api/schedules/${edit ? "edit" : "create"}/${propsData.groupName}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        name: formData.name,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        description: formData.description,
        link: formData.link,
        ...(!edit && { includeEveryone: formData.includeEveryone }),
        ...(!edit && { type: formData.type }),
        ...(edit && { id: placeholders.id })
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
      // reset fields
      reset()
      setTimeout(() => {
        props.setShowForm()
        setRequestSuccess(false)
        props.getRefresh()
      }, 1000)
    }

  }

  const setShowFormLocal = () => {
    if (propsData.showForm) {
      propsData.setShowForm()
    }
  }


  return (
    <div className={`absolute h-screen inset-0 ${propsData.showForm ? "overflow-hidden" : "hidden"}`}>
      <div className=" flex justify-center h-screen items-center bg-blue-200 bg-opacity-70  antialiased">
        <div className="flex flex-col w-11/12 sm:w-5/6 lg:w-1/2 max-w-md mx-auto rounded-lg border border-gray-300 shadow-xl">
          <ClickAwayListener onClickAway={setShowFormLocal}>
            <div className="overflow-auto max-h-90vh rounded-lg">
              <div
                className="flex flex-row justify-items-center p-6 bg-white border-b border-gray-200 rounded-tl-lg rounded-tr-lg"
              >

                <form id="newScheduleForm" className="flex flex-col space-y-0  self-center w-full py-0 px-2" onSubmit={handleSubmit(handleNewSchedule)}>

                  <div className="block">
                    <label htmlFor="event" className="text-gray-700">Event name</label>
                    <input
                      id="event"
                      name="event"
                      type="text"
                      {...register('name')}
                      defaultValue={placeholders.name ? placeholders.name : ""}


                      className={` bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 ${errors.name ? 'border-red-500  ' : ''} `}
                      placeholder="webinar asdf1234"
                    />
                    <p className="text-red-500 text-xs italic">{errors.name?.message}</p>

                  </div>

                  <div className="block">
                    <span className="text-gray-700">Enter date</span>
                    <input
                      {...register('date')}
                      placeholder="yyyy-mm-dd (pls update safari lol)"
                      type="date"
                      max="2026-05-01" min={todayString}
                      defaultValue={placeholders.date ? placeholders.date : ""}

                      className={` bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 ${errors.date ? 'border-red-500  ' : ''} `}
                    />
                    <p className="text-red-500 text-xs italic">{errors.date?.message}</p>

                  </div>
                  <div className="block">

                    <div className="flex flex-col sm:flex-row items-center sm:space-x-5">
                      <div className="w-full sm:w-1/2">
                        <span className="text-gray-700">Start time</span>
                        <input
                          {...register('startTime')}
                          placeholder="HH:MM"
                          defaultValue={placeholders.startTime ? placeholders.startTime : ""}


                          type="time"
                          className={` bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 ${errors.startTime ? 'border-red-500  ' : ''} `}
                        />
                        <p className="text-red-500 text-xs italic">{errors.startTime?.message}</p>

                      </div>


                      <div className="w-full sm:w-1/2">
                        <span className="text-gray-700">End time</span>
                        <input
                          {...register('endTime')}
                          placeholder="HH:MM"
                          defaultValue={placeholders.endTime ? placeholders.endTime : ""}

                          type="time"
                          className={` bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 ${errors.endTime ? 'border-red-500   ' : ''} `}
                        />

                      </div>
                    </div>
                  </div>

                  {!edit &&
                    <div className="block">
                      <span className="text-gray-700">Type</span>
                      <select
                        required={false}
                        {...register('type')}
                        defaultValue="other"
                        className={` bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 `}
                      >
                        <option value="lecture">Lecture</option>
                        <option value="webinar">Webinar</option>
                        <option value="meeting">Meeting</option>
                        <option value="studyGroup">Study Group</option>
                        <option value="event">Event</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  }

                  <div className="block">
                    <span className="text-gray-700">Description</span>
                    <textarea
                      className={` bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 `}
                      rows={3}
                      {...register('description')}
                      placeholder="about the event"
                      defaultValue={placeholders.description ? placeholders.description : ""}
                    ></textarea>
                  </div>

                  <div className="block">
                    <label htmlFor="link" className="text-gray-700">related link</label>
                    <input
                      type="link"
                      name="link"
                      id="link"
                      {...register('link')}
                      className={` bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 ${errors.link ? 'border-red-500  ' : ''} `}
                      // className={`mt-1 w-full rounded-md bg-gray-100 focus:bg-white focus:ring-0 focus:outline-none  focus:border-purple-500 ${errors.link ? 'border-red-500  mb-3 ' : ''} `}
                      placeholder="https://zzoom.com/meet/asdfasdfasdf"
                      defaultValue={placeholders.link ? placeholders.link : ""}

                    />
                    <p className="text-red-500 text-xs italic">{errors.link?.message}</p>
                  </div>

                  {!edit &&
                    <div className="block">
                      <input
                        name="allParticipate"
                        id="allParticipate"
                        type="checkbox"
                        {...register('includeEveryone')}
                        className="rounded bg-gray-200 border-transparent focus:border-transparent focus:bg-gray-200 text-gray-700 focus:ring-1 focus:ring-offset-2 focus:ring-gray-500"
                      />
                      <label htmlFor="allParticipate" className="ml-2">I think everyone in this group is participating</label>
                    </div>
                  }

                </form>
              </div>
              <div
                className="flex flex-row items-center justify-between p-5 bg-white border-t border-gray-200 rounded-bl-lg rounded-br-lg"
              >
                <button onClick={() => propsData.setShowForm()} className="font-semibold text-gray-600">Cancel</button>

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

                <button type="submit" form="newScheduleForm" className="px-4 py-2 text-white font-semibold bg-blue-500 rounded">
                  {placeholders.name ? "Update" : "Create"}

                </button>
              </div>
            </div>
          </ClickAwayListener>

        </div>
      </div>
    </div>

  )
}
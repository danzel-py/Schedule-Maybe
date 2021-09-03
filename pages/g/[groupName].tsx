import Link from 'next/link'
import { useRouter } from 'next/dist/client/router'
import { useForm } from 'react-hook-form'
import Layout from '../../components/Layout'
import useSWR from 'swr'
import { useState } from 'react'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function GroupPage() {
  const router = useRouter()
  const { groupName } = router.query
  const [message, setMessage] = useState<string>('')
  const [success, setSuccess] = useState<boolean>(false)
  const [showForm, setShowForm] = useState<boolean>(false)

  const { data, error } = useSWR(`/api/groups/get/${groupName}`, fetcher)
  const { register, formState: { errors }, handleSubmit } = useForm<FormData>()


  const handlePurge = async () => {
    const res = await fetch(`/api/groups/purge/${groupName}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      }
    }).then((r) => r.json())

    setMessage(res.message)
    if (res.success) {
      setSuccess(true)
    }
    /*
    * res.message
    * res.success
    */
  }

  const handleNewSchedule = async (formData) => {
    console.log(formData)
  }

  if (error) return <div>{error}</div>
  if (!data) return <div>loading...</div>
  if (message) return (
    <div>
      {success && <>
        Deleted, </>}
      {message}
    </div>
  )
  if (data.groupNotFound) return (
    <div>
      group not found<br />
      <Link href='/g/create'>
        <a>
          Create a new group
      </a>
      </Link>
      <br />
      <Link href='/g/join'>
        <a>
          Join existing
      </a>
      </Link>
    </div>
  )



  return (
    <Layout>
      <h1>
        Welcome to {data.groupData?.name}
      </h1>

      {data.groupData?.admin && <>Youre an admin
        <div>
          <button className="h-10 px-5 m-2 text-red-100 transition-colors duration-150 bg-red-700 rounded-lg focus:shadow-outline hover:bg-red-800" onClick={handlePurge}>Purge group</button>

        </div>
      </>}

      {data.groupData.member && <>Youre a member {data.groupData.member}</>}

      {(data.groupData.member || data.groupData.admin) &&
        <div>
          Eligible to get schedules <br></br>

          <ul>

            {data.groupData.schedules.map((schedule) => {
              return (
                <li>
                  {schedule.name}
                  {" | "}
                  {schedule.description}
                  {" | "}
                  {schedule.startTime}
                  {" | "}
                  {schedule.endTime}
                </li>
              )
            })}
          </ul>
          <button onClick={() => setShowForm(!showForm)} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
            new schedule</button>

          <div className={`${showForm ? "hidden" : ""}`}>
            <div className="mt-8 max-w-md">
              <div className="grid grid-cols-1 gap-6">
                <form className="py-12" onSubmit={handleSubmit(handleNewSchedule)}>

                  <div className="block">
                    <label htmlFor="event" className="text-gray-700">Event name</label>
                    <input
                      id="event"
                      name="event"
                      type="text"
                      {...register('name')}

                      className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
                      placeholder="webinar asdf1234"
                    />
                  </div>

                  <div className="block">
                    <span className="text-gray-700">When is your event?</span>
                    <input
                                          {...register('date')}

                      type="date"
                      className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
                    />
                  </div>

                  <div className="block">
                    <span className="text-gray-700">startTime</span>
                    <input
                                          {...register('startTime')}

                      type="time"
                      className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
                    />
                  </div>

                  <div className="block">
                    <span className="text-gray-700">endTime</span>
                    <input
                                          {...register('endTime')}

                      type="time"
                      className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
                    />
                  </div>

                  <div className="block">
                    <span className="text-gray-700">sebuah drop down</span>
                    <select
                                          {...register('ddown')}

                      className="block w-full mt-1 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
                    >
                      <option>pil 1</option>
                      <option>pil 2</option>
                      <option>pil 3</option>
                      <option>other</option>
                    </select>
                  </div>

                  <div className="block">
                    <span className="text-gray-700">Description</span>
                    <textarea
                      className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
                      rows={3}
                      {...register('about')}
                      placeholder="about the event"
                    ></textarea>
                  </div>

                  <div className="block">
                    <label htmlFor="link" className="text-gray-700">related link</label>
                    <input
                      type="link"
                      name="link"
                      id="link"
                      {...register('link')}
                      className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
                      placeholder="https://zzoom.com/meet/asdfasdfasdf"
                    />
                  </div>

                  <div className="block">
                    <input
                      name="allParticipate"
                      id="allParticipate"
                      type="checkbox"
                      {...register('allParticipate')}
                      className="rounded bg-gray-200 border-transparent focus:border-transparent focus:bg-gray-200 text-gray-700 focus:ring-1 focus:ring-offset-2 focus:ring-gray-500"
                    />
                    <label htmlFor="allParticipate" className="ml-2">I think everyone in this group is participating</label>
                  </div>

                  

                  <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Button</button>

                </form>
              </div>
            </div>
          </div>

        </div>
      }

    </Layout>
  )
}


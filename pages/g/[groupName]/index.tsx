import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'
import useSWR from 'swr'
import { useEffect, useState } from 'react'
import ScheduleForm from '../../../components/Forms/ScheduleForm'
import GroupEditForm from '../../../components/Forms/GroupEditForm'
import GroupMemberList from '../../../components/Groups/GroupMemberList'
import { useSession } from "next-auth/client"
// import ScheduleList from '../../../components/Schedules/ScheduleList'
import { fetcher } from '../../../helpers/fetcher'
import ScheduleBoardList from '../../../components/Schedules/ScheduleBoardList'

export default function GroupPage() {
  const [session, loading] = useSession()
  const router = useRouter()
  const { groupName } = router.query
  const { isValidating, data, error, mutate } = useSWR(`/api/groups/get/${groupName}`, fetcher)
  const [showEdit, setShowEdit] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [requestSuccess, setRequestSuccess] = useState<boolean>(false)
  const [handlingRequest, setHandlingRequest] = useState<boolean>(false)

  const handleRequestSuccess = (a: boolean) => {
    setRequestSuccess(a)
  }
  const handleMessage = (a: string) => {
    setMessage(a)
  }
  const handleHandlingRequest = (a: boolean) => {
    setHandlingRequest(a)
  }



  // FORM Stuffs
  const [showForm, setShowForm] = useState<boolean>(false)
  const [formPlaceholders, setFormPlaceholders] = useState<object>({ edit: false })
  const handleSetShowForm = (edit: boolean = false, placeholders?: Object) => {
    if (edit) {
      setShowForm(true)
      setFormPlaceholders(placeholders)
    } else {
      setFormPlaceholders({ edit: false })
      setShowForm(!showForm)
    }
  }
  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [showForm])


  const handleEditGroup = () => {
    if (showEdit) {
      setShowEdit(false)
    } else {
      setShowEdit(true)
    }
  }

  const handleRefreshData = () => {
    mutate()
  }


  // leave group
  const handleLeave = async () => {
    setMessage("please wait");
    const res = await fetch(`/api/groups/kick/${data.groupData.id}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        memberId: session.id
      })
    })
      .then(r => r.json())
      .then(()=>{
        setMessage('')
        router.push("/groups")
      })
      .catch((err) => {
        console.error(err)
        setMessage(
          err
        )
      })
  }



  useEffect(() => {
    if (!session && !loading) {
      router.push('/')
    }
  }, [session])

  useEffect(()=>{
    if(!isValidating){
      setRequestSuccess(false);
    }
  },[isValidating])

  if (error) return <div>{error}</div>
  if (!data) return <Layout>loading...</Layout>
  if (data.groupNotFound) return (
    <Layout>
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
    </Layout>
  )



  return (
    <Layout>
      <div className='flex flex-col divide-y-2'>

        <section className={`flex flex-row justify-between`}>
          <div onClick={() => { setShowEdit(false) }} className="text-2xl sm:text-4xl">

            {data.groupData.name}
          </div>


          <div className='text-sm sm:text-base'>

            {data.groupData.admin ?
              <div>
                <button className="text-red-500 bg-gray-100" onClick={handleEditGroup}>{showEdit ? "back" : "Edit group"}</button>
                  ADMIN
                </div>
              : data.groupData.member ?
                <div>
                  <button className="text-red-500 bg-gray-100 " onClick={handleEditGroup}>{showEdit ? "back" : "Group info"}</button>
                  MEMBER
                </div>
                :
                <div>
                </div>
            }
          </div>
        </section>
        <div className="flex flex-row justify-between">
          <div className='w-3/4'>

            {data.groupData.about}
          </div>
          <button
            onClick={isValidating ? () => console.log("wait") : () => mutate()}
            className={`p-2 h-10 ${isValidating ? "bg-indigo-100" : "bg-gray-100 hover:bg-gray-200"}`}
          >
            {isValidating ? "refreshing.." : "refresh"}
          </button>
        </div>



        <section>
          {(data.groupData.member || data.groupData.admin) && !showEdit &&
            <div className="flex sm:flex-row flex-col justify-around">

              <aside className="flex flex-col">
                <button onClick={() => setShowForm(!showForm)} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                  new schedule
              </button>
                {message &&
                  <div>
                    {message}
                  </div>
                }
                {requestSuccess&&
                  <div>
                    Success!
                  </div>
                }
                {handlingRequest&&
                <div>
                  Handling request.. please wait
                </div>

                }
              </aside>
              <div className="sm:w-1/2 w-11/12">

                <ScheduleBoardList setShowForm={handleSetShowForm} board={data.groupData.schedules} session={session} mutate={mutate}
                  setHandlingRequest={handleHandlingRequest}
                  setMessage={handleMessage}
                  setRequestSuccess={handleRequestSuccess}
                />
              </div>


            </div>
          }
          {showEdit &&
            <div className="flex flex-col md:flex-row w-full justify-center gap-x-6">
              {/* ADMIN FORM */}
              {data.groupData.admin &&
                <div className="w-1/3">
                  <GroupEditForm groupData={data.groupData} />
                </div>
              }
              {/* MEMBER */}
              {data.groupData.member && 
                <div>
                  <button 
                  className="text-red-500 bg-red-100 text-sm"
                  onClick={handleLeave}
                  >
                  leave group
                  </button>
                  {message}
                  </div>
              }
              <div className="md:w-2/3 w-11/12">
                <GroupMemberList groupId={data.groupData.id} memberList={data.groupData.memberList} author={data.groupData.author} session={session} />
              </div>
            </div>
          }
          {!data.groupData.member && !data.groupData.admin && !showEdit &&
            <div>
              <button onClick={() => { router.push({ pathname: '/g/join', query: { groupName: data.groupData.name } }) }}>
                Click here to join
            </button>
            </div>
          }
        </section>
      </div>
      <ScheduleForm showForm={showForm} setShowForm={handleSetShowForm} groupName={groupName} placeholders={formPlaceholders} getRefresh={handleRefreshData} />

    </Layout>
  )
}


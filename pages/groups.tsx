import { useSession } from 'next-auth/client'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import Layout from '../components/Layout'
import { sortDescending } from '../helpers/sorter'
import GroupList from '../components/Groups/GroupList'
import { fetcher } from '../helpers/fetcher'
import Link from 'next/link'

export default function groupsPage() {
  const [session, loading] = useSession()
  const { isValidating, data, error, mutate } = useSWR(`/api/users/get/groups`, fetcher)
  const [showOtherGroups, setShowOtherGroups] = useState<boolean>(false)

  const [groupList, setGroupList] = useState([])

  useEffect(() => {
    if (data) {
      let newArr= []


        newArr = [...(data.user?.groupsAuthored&&data.user?.groupsAuthored), ...(data.user?.groupsEnrolled && data.user?.groupsEnrolled)]
      sortDescending(newArr, 'updatedAt')
      setGroupList(newArr)
    }
  }, [data])

  if (!data) {
    return (
      <Layout>
        loading...
      </Layout>
    )
  }

  return (<Layout>
    <title>Groups</title>
    <div className="flex flex-col gap-y-8">

      {/* first section */}
      <div>
        <div className="text-2xl">Your Groups</div>
        <div>{'Sorted by '}
          <button
            className="bg-gray-100 hover:bg-gray-200"
          >
            last update
           </button>
        </div>

        <div className="flex sm:flex-row flex-col justify-between max-w-2xl">
          <div className="sm:w-2/3 w-5/6 self-center">
            <GroupList groupList={groupList} />
          </div>
          <nav className="flex flex-col justify-center items-center sm:w-1/3">

            <Link href="/g/join">
              <a
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
              >
                join a group
        </a>
            </Link>
            <p>or</p>
            <Link href="/g/create">
              <a
                className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              >
                create a group
        </a>
            </Link>
          </nav>
        </div>
      </div>
      {/* end first section */}

      <hr></hr>
      <div>
        <div className="text-xl">
          Public groups to join:
          </div>
        <div className="bg-gray-200 hover:bg-gray-100"
          onClick={() => setShowOtherGroups(!showOtherGroups)}
        >
          {showOtherGroups ? "hide all" : "show all"}

        </div>
        {showOtherGroups &&
          <>
            <GroupList groupList={data.otherGroups} notEnrolled={true} />
          </>
        }
      </div>

    </div>

  </Layout>)


}
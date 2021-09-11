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

  const [groupList, setGroupList] = useState([])

  useEffect(() => {
    if (data) {
      let newArr = [...data.user.groupsAuthored, ...data.user.groupsEnrolled]
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
    <div>Your Groups</div>

    <div>{'Sorted by '}
      <button
        className="bg-gray-100 hover:bg-gray-200"
      >
        last update
      </button>
    </div>
    <div className="flex flex-row justify-between max-w-lg">
      <GroupList groupList={groupList} />
      <nav className="flex flex-col justify-evenly">

        <Link href="/g/join">
          <a
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
          >
            join a group
        </a>
        </Link>
        <Link href="/g/create">
          <a
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          >
            create a group
        </a>
        </Link>
      </nav>
    </div>

  </Layout>)


}
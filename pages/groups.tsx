import { useSession } from 'next-auth/client'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import Layout from '../components/Layout'
import {sortDescending} from '../helpers/sorter'
import GroupList from '../components/Groups/GroupList'
import {fetcher} from '../helpers/fetcher'
import Link from 'next/link'


export default function groupsPage() {
  const [session, loading] = useSession()
  const {isValidating, data, error, mutate} = useSWR(`/api/users/get/groups`, fetcher)

  const [groupList, setGroupList] = useState([])

  useEffect(()=>{
    if(data){
      let newArr = [...data.user.groupsAuthored,...data.user.groupsEnrolled]
      sortDescending(newArr,'updatedAt')
      setGroupList(newArr)
    }
  },[data])

  // useEffect(()=>{
  //   console.log(groupList)
  // },[groupList])

  if(!data){
    return(
      <Layout>
        loading...
      </Layout>
    )
  }

  return(<Layout>
      Sorted by last update
      <GroupList groupList={groupList}/>
      <Link href="/g/join">
        <a>
          join a group
        </a>
      </Link>
      <Link href="/g/create">
        <a>
          create a group
        </a>
      </Link>
  </Layout>)


}
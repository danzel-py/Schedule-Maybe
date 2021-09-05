import { useSession } from 'next-auth/client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import Layout from '../components/Layout'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function groupsPage() {
  const [session, loading] = useSession()
  const {isValidating, data, error, mutate} = useSWR(`/api/users/get/groups`, fetcher)

  const [groupList, setGroupList] = useState([])

  useEffect(()=>{
    if(data){
      let newArr = [...data.user.groupsAuthored,...data.user.groupsEnrolled]
      newArr.sort((a,b)=>{
        if(a.updatedAt < b.updatedAt){
          return 1
        }else if(a.updatedAt > b.updatedAt){
          return -1
        }
        return 0
      })
      setGroupList(newArr)
    }
  },[data])

  // useEffect(()=>{
  //   console.log(groupList)
  // },[groupList])

  if(!data){
    return(
      <div>
        loading...
      </div>
    )
  }

  return(<Layout>
      Sorted by last update
    <ul>
      {groupList.map((group)=>{return(
        <li>
          <Link href={`/g/${group.name}`}>
          <a>
          {group.name}
          {group.enterKey && " me admin"}

          </a>
          </Link>
        </li>
      )})}    
    </ul>
  </Layout>)


}
import Link from 'next/link'
import { useEffect, useState } from "react"

export default function GroupList(props){
  const [groupList, setGroupList] = useState<object[]>([])


  useEffect(()=>{
    setGroupList(props.groupList)
  },[props.groupList])

  return(
    <ul>
      {props.groupList.map((group)=>{return(
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
  )
}
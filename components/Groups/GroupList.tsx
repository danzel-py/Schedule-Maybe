import Link from 'next/link'
import { useEffect, useState } from "react"

export default function GroupList(props) {
  const [groupList, setGroupList] = useState<object[]>([])


  useEffect(() => {
    setGroupList(props.groupList)
  }, [props.groupList])

  return (
    <ul className="w-1/2 divide-y-2">
      {props.groupList.map((group) => {
        return (
          <li className="hover:bg-red-100">
            <Link href={`/g/${group.name}`}>
              <a>
                <div className="flex flex-row justify-between">
                  <div className='text-lg'>
                    {group.name}
                  </div>
                  <div className='text-sm'>
                    {group.enterKey ? "ADMIN" : "MEMBER"}
                  </div>
                </div>
                <div className='text-sm'>
                  {group.about}
                </div>
              </a>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
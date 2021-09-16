import Link from 'next/link'
import { useEffect, useState } from "react"

// todo: show member count

export default function GroupList(props) {
  const [groupList, setGroupList] = useState<object[]>([])


  useEffect(() => {
    setGroupList(props.groupList)
  }, [props.groupList])

  return (
    <ul className="w-full divide-y-2">
      {props.groupList.map((group) => {
        return (
          <li className="hover:bg-red-100">
            <Link href={`/g/${group.name}`}>
              <a>
                <div className="flex flex-row justify-between">
                  <div>
                    <div className='text-lg'>
                      {group.name}
                    </div>


                  </div>
                  <div className='text-sm'>
                    <p>
                      {group.enterKey ? "ADMIN" : props.notEnrolled ? "" : "MEMBER"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-row justify-between">

                  <div className='text-sm'>

                    {group.about}
                  </div>
                  <div className='inline-block'>
                    <div className="inline-block h-6">

                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="inline-block w-3 align-center h-6">

                      {group.count}
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
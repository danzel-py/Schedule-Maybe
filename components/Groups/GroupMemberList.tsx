import { useState } from "react"

// TODO: invite?

export default function GroupMemberList(props) {
  const [message,setMessage] = useState<string>('')
  const handleKick = async (memberId: number) => {
    const res = await fetch(`/api/groups/kick/${props.groupId}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        memberId
      })
    })
      .then(r => r.json())
      .catch((err) => {
        console.error(err)
      })
    
  }


  if (!props.memberList) {
    return (
      <div>
        empty
      </div>
    )
  }

  return (
    <ul className="divide-y-2">
      {
        props.memberList.map((member, i) => {
          return (
            <li key={i}>
              <div className="flex flex-row justify-between">
                <div>
                  {member.name}
                </div>
                <button onClick={() => handleKick(member.id)}>
                  {"kick"}
                </button>
              </div>
              <div>
                {member.email}
              </div>
            </li>
          )
        })

      }
    </ul>
  )
}
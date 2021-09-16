import { session } from "next-auth/client"
import { useState } from "react"

// TODO: invite?
// TODO: show admin

export default function GroupMemberList(props) {
  const [message, setMessage] = useState<string>('')
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
    <div className="">
      <div className="text-center">
        Author
        </div>
      <div >
        <div className="flex flex-row justify-between">
          <div className="text-xl">
            {props.author.name}
          </div>
        </div>
        <div className="text-sm">
          {props.author.email}
        </div>
      </div>
      <div>
      <div className="text-center">

      Member
      </div>
      <ul className="divide-y-2">
        {
          props.memberList.map((member, i) => {
            return (
              <li key={i}>
                <div className="flex flex-row justify-between">
                  <div className="text-xl">
                    {member.name}
                  </div>
                  {props.session.id === props.author.id &&
                  <button onClick={() => handleKick(member.id)}>
                    {"kick"}
                  </button>
                  }
                </div>
                <div className="text-sm">
                  {member.email}
                </div>
              </li>
            )
          })

        }
      </ul>
      </div>

    </div>
  )
}
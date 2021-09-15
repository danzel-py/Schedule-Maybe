import Link from 'next/link'
import { useSession } from "next-auth/client"

// TODO: sm dropdown menu

export default function Navbar() {
  const [session] = useSession()

  return (
    <header>
      <div className=" flex flex-row justify-between w-full bg-blue-100 px-4">


      <div className="left-header h-10 leading-10">

      {session &&
        <>
          <Link href="/dashboard">
            <a className="inline-block">Dashboard</a>
          </Link>{' '}
          |{' '}
          <Link href="/calendar">
            <a className="inline-block">Calendar</a>
          </Link>{' '}
          |{' '}
          <Link href="/groups">
            <a className="inline-block">Groups</a>
          </Link>
          {' '}
              |{' '}
          <Link href="/preferences">
            <a className="inline-block">Preferences</a>
          </Link>
        </>
      }
      </div>

      <div className="right-header h-10 leading-10 flex flex-row gap-x-2">
        {!session ?
          <>
            <Link href="/signin">
              <a className="">Sign in</a>
            </Link>{' '}
          |{' '}
          </>
          :
          <>
            <Link href="/signout">
              <a className="" >Sign out</a>
            </Link>
            {' '}
        |{' '}</>
        }

        <Link href="/">
          <a><img src="https://i.ibb.co/prg0xz6/Drawing-1-sketchpad.png" alt="placeholder-logo-1" className="h-8" /></a>
        </Link>
      </div>
      </div>

    </header>
  )
}
import Link from 'next/link'
import { useSession } from "next-auth/client"

export default function Navbar() {
  const [session] = useSession()

  return (
    <header>


      {session &&
        <>
          <Link href="/dashboard">
            <a>Dashboard</a>
          </Link>{' '}
          |{' '}
          <Link href="/calendar">
            <a>Calendar</a>
          </Link>{' '}
          |{' '}
          <Link href="/profile">
            <a>Profile</a>
          </Link>{' '}
          |{' '}
          <Link href="/preferences">
            <a>Preferences</a>
          </Link>
          {' '}
            |{' '}
          <Link href="/logout">
            <a>Logout</a>
          </Link>
          {' '}
              |{' '}
        </>
      }

      {!session &&
      <>
      <Link href="/login">
        <a>Login</a>
      </Link>{' '}
          |{' '}
      </>
      }

      <Link href="/">
        <a>Slogo</a>
      </Link>
      <hr />
    </header>
  )
}
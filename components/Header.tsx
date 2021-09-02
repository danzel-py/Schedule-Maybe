import Link from 'next/link'

export default function Navbar() {
  return (
    <header>
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
      </Link>{' '}
          |{' '}
      <Link href="/logout">
        <a>Logout</a>
      </Link>{' '}
          |{' '}
      <Link href="/login">
        <a>Login</a>
      </Link>
      <hr />
    </header>
  )
}
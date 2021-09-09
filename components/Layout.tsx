import Header from './Header'

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main className="mx-auto sm:py-1 sm:px-2 p-0">{children}</main>
    </>
  )
}
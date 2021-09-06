import Layout from '../components/Layout'
import { getSession } from 'next-auth/client'


export async function getServerSideProps(context) {
  const session = await getSession(context)
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  return {
    props: { session }
  }
}

export default function Logout({session}) {
  return (
    <Layout>
      <h1>
        Logout
      </h1>
    </Layout>
  )
}


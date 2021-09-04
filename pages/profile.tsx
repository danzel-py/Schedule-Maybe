import { getSession } from 'next-auth/client'
import { useEffect } from 'react'
import Layout from '../components/Layout'

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

export default function Profile({session}) {
  useEffect(()=>{
    // console.log(session)
  },[])
  
  return (
    <Layout>
      <h1>
        profile: edit?
      </h1>
    </Layout>
  )
}


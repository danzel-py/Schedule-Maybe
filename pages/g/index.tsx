import { getSession } from 'next-auth/client'
import { useEffect } from 'react'
import Layout from '../../components/Layout'

export async function getServerSideProps(context) {
  return {
    redirect: {
      destination: '/g/join',
      permanent: true,
    },
  }
}

export default function GIndex() {
  useEffect(() => {
  }, [])

  return (
    <Layout>
      <h1>
        never render this...
      </h1>
    </Layout>
  )
}


import { useRouter } from 'next/dist/client/router'
import Layout from '../../components/Layout'


export default function User() {
  const router = useRouter()
  const { id } = router.query
  return (
    <Layout>
      <h1>
        user with some id: {id}
      </h1>
    </Layout>
  )
}


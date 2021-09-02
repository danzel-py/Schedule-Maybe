import { useRouter } from 'next/dist/client/router'
import Layout from '../../components/Layout'


export default function Group() {
  const router = useRouter()
  const { id } = router.query
  return (
    <Layout>
      <h1>
        group with some id: {id}
      </h1>
    </Layout>
  )
}


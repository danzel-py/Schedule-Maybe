import Layout from '../components/Layout'
import MonthlyCalendar from '../components/Calendar/MonthlyCalendar'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { session, useSession } from 'next-auth/client'
import { fetcher } from '../helpers/fetcher'
import useSWR from 'swr'


export default function Calendar() {
  const router = useRouter()
  const [session, loading] = useSession()
  // const { isValidating, data, error, mutate } = useSWR(`/api/users/get/schedules}`, fetcher)

 

  return (
    <Layout>
      <h1>
        caleeeendaaar
      </h1>
      <MonthlyCalendar />

    </Layout>
  )
}


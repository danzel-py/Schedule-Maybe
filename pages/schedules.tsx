import { useSession } from 'next-auth/client'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import Layout from '../components/Layout'
import { fetcher } from '../helpers/fetcher'
import Link from 'next/link'


export default function schedules (){
  const [session, loading] = useSession()
  const { isValidating, data, error, mutate } = useSWR(`/api/schedules/public`, fetcher)

  if(!data){
    return(
      <Layout>
        loading data
      </Layout>
    )
  }

  return(
    <Layout>
      Hi
      {data.success && 
      <div>
        {data.schedules.length  === 0&& 
        <>
          no public schedules available, join some groups
        </>
        }
        {data.schedules.map((sch)=>{
          return(
            <p>{sch.name}</p>
          )
        })}
      </div>
      }
      {!data.success &&
      <div>
        error getting data
      </div>
      }
    </Layout>
  )
}
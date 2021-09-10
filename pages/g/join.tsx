import Layout from '../../components/Layout'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Link from 'next/link'
import * as Yup from 'yup'
import type { IFormJoinGroup } from '../../types/form'
import Router from 'next/router'


/*
* JOIN GROUP
params: name, enterKey
*/

export default function JoinGroup() {
  const [message, setMessage] = useState<string>('')

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Please specify group name')
      .matches(/^[a-zA-Z0-9_.]*$/, 'Invalid group name')
      .min(4, 'Invalid group name')
      .max(25, 'Invalid group name'),
    enterKey: Yup.string()
      .required('Invalid enter key')
      .min(1, 'Invalid enter key')
      .max(10, 'Invalid enter key')
  })

  const { register, formState: { errors }, handleSubmit } = useForm<IFormJoinGroup>({
    resolver: yupResolver(validationSchema)
  })

  async function handleJoin(formData: IFormJoinGroup) {
    const res = await fetch('/api/groups/join', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        name: formData.name,
        enterKey: formData.enterKey,
      })
    })
      .then(r => r.json())
      .catch((err) => {
        console.error(err)
      })

    /*
      * res.success, res.groupName on success
      * res.message on failure
      */
    if(res.success){
      Router.push(`/g/${res.groupName}`)
   }
   if(res.message){
      console.log(res.message)
      setMessage(res.message)
   }
    // redirect to g/something
  }

  const formEnd = useRef(null)

  const scrollToBottom = () => {
    formEnd.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, []);




  return (
    <Layout>
      <div className="flex h-screen">
        <div className="w-full max-w-md m-auto">


          {message &&

            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-3" role="alert">
              <strong className="font-bold">Holy smokes!</strong><br />
              <span className="block sm:inline">{message}</span>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <svg onClick={() => setMessage('')} className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
              </span>
            </div>
          }

          <form className="w-full max-w-md"
            onSubmit={handleSubmit(handleJoin)}
          >


            <div className="md:flex md:items-center mb-6">
              <div ref={formEnd} className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-group-name">
                  Group
      </label>
              </div>
              <div className="md:w-2/3">
                <input className={`bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 ${errors.name ? ' border-red-500  mb-3 ' : ''} `}
                  id="inline-group-name"
                  name="name"
                  type="text"
                  placeholder="sigma-hustler-420"
                  {...register('name')}
                />

                <p className="text-red-500 text-xs italic my-0">{errors.name?.message}</p>
              </div>
            </div>



            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-enterKey">
                  Enter Key
      </label>
              </div>
              <div className="md:w-2/3">
                <input className={` bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 ${errors.enterKey ? 'border-red-500  mb-3 ' : ''} `}
                  id="inline-enterKey"
                  name="enterKey"
                  type="text"
                  placeholder="*******"
                  {...register('enterKey')}
                />
                <p className="text-red-500 text-xs italic">{errors.enterKey?.message}</p>

              </div>
            </div>
            <div className="md:flex md:items-center">
              <div className="md:w-1/3"></div>
              <div className="md:w-2/3 flex items-center justify-between">

                <button className="md:w-3/12 shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
                  Join
              </button>
                <div className="md:w-3/12"></div>
                <div className="md:w-3/6">
                  <Link href="/g/create">
                    <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                      Create a new group
                </a>
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}


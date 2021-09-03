import Layout from '../../components/Layout'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { IFormCreateGroup } from '../../interfaces/index'

export default function CreateGroup() {
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Please specify group name')
      .matches(/^[a-zA-Z0-9_.]*$/, 'Only alphanumerics, dots, and low dashes are allowed')
      .min(4, 'Must be at least 4 characters')
      .max(25, 'Must not exceed 25 characters'),
    about: Yup.string()
      .required('Please provide brief description (10-200 characters)')
      .min(10, 'Too short!')
      .max(200, 'Too lengthy!'),
    enterKey: Yup.string()
      .required('Please provide a key for users to join')
      .min(1, 'At least 1 character lul')
      .max(10, 'Too lengthy! Must not exceed 10 characters')
  })





  const { register, formState: { errors }, handleSubmit } = useForm<IFormCreateGroup>({
    resolver: yupResolver(validationSchema)
  })

  async function handleCreate(formData: IFormCreateGroup) {
    console.log(formData)
    const res = await fetch('/api/groups/create', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        name: formData.name,
        enterKey: formData.enterKey,
        about: formData.about,
      })
    })
      .then(r => r.json())
      .catch((err) => {
        console.error(err)
      })
    // this res is response


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
          <form className="w-full max-w-md"
            onSubmit={handleSubmit(handleCreate)}
          >


            <div className="md:flex md:items-center mb-6">
              <div ref={formEnd} className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-group-name">
                  Group</label>
              </div>
              <div className="md:w-2/3">
                <input className={` bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 ${errors.name ? 'border-red-500  mb-3 ' : ''} `}
                  id="inline-group-name"
                  name="name"
                  type="text"
                  placeholder="sigma-hustler-420"
                  {...register('name')}
                />
                <p className="text-red-500 text-xs italic">{errors.name?.message}</p>

              </div>
            </div>




            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-about">
                  Description</label>
              </div>
              <div className="md:w-2/3">
                <textarea className={` bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 ${errors.about ? 'border-red-500  mb-3 ' : ''} `}
                  id="inline-about"
                  name="about"
                  rows={3}
                  placeholder="This group is for my 24h hustler gang only."
                  {...register('about')}
                />
                <p className="text-red-500 text-xs italic">{errors.about?.message}</p>

              </div>
            </div>




            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-enterKey">
                  Enter Key</label>
              </div>
              <div className="md:w-2/3">
                <input className={` bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 ${errors.enterKey ? 'border-red-500  mb-3 ' : ''} `}
                  id="inline-enterKey"
                  name="enterKey"
                  type="password"
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
                <div className="md:w-3/9"></div>
                <div  className="md:w-3/9">
                  <Link href="/g/join">
                    <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                      Join a group
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


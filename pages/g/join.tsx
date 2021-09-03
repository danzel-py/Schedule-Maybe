import Layout from '../../components/Layout'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Link from 'next/link'
import * as Yup from 'yup'
import type { IFormJoinGroup } from '../../interfaces/index'

/*
* JOIN GROUP
params: name, enterKey
*/

export default function JoinGroup() {
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
    // this res is response


    // redirect to g/something
  }





  return (
    <Layout>
      <div className="flex h-screen">
        <div className="w-full max-w-md m-auto">
          <form className="w-full max-w-md"
            onSubmit={handleSubmit(handleJoin)}
          >
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-group-name">
                  Group
      </label>
              </div>
              <div className="md:w-2/3">
                <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="inline-group-name"
                  name="name"
                  type="text"
                  placeholder="sigma-hustler-420"
                  {...register('name')}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-enterKey">
                  Enter Key
      </label>
              </div>
              <div className="md:w-2/3">
                <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="inline-enterKey"
                  name="enterKey"
                  type="password"
                  placeholder="*******"
                  {...register('enterKey')}
                />
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
                <Link href="/signup">
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


import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { IFormCreateGroup } from '../../types/form'
import { useRouter } from 'next/router'
import {format,parseISO} from 'date-fns'

// TODO: make private, make strict

export default function GroupEditForm(props) {
  const router = useRouter()
  const [message, setMessage] = useState<string>('')
  const [success, setSuccess] = useState<boolean>(false)
  const [handlingRequest, setHandlingRequest] = useState<boolean>(false)


  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Can\'t be empty')
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

  const { reset, register, formState: { errors }, handleSubmit } = useForm<IFormCreateGroup>({
    resolver: yupResolver(validationSchema)
  })

  useEffect(() => {
    // :) react-hook-form moment
    let formDefaultValues = {
      name: props.groupData.name,
      about: props.groupData.about,
      enterKey: props.groupData.enterKey
    }
    if (props.groupData) {
      reset(formDefaultValues)
    }

  }, [reset, props.groupData])

  async function handleEdit(formData: IFormCreateGroup) {
    if (
      props.groupData.name === formData.name 
    &&props.groupData.enterKey === formData.enterKey
    &&props.groupData.about === formData.about
    ){
      return
    }

    const res = await fetch(`/api/groups/edit/${props.groupData.id}`, {
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
    /*
    * res.success, res.groupName on success
    * res.message on failure
    */
    if (res.success) {
      setSuccess(true)
      setTimeout(()=>{
        // redirect on groupName change
        router.push(`/g/${res.groupName}`)
      },2000)
    }
    if (res.message) {
      console.log(res.message)
    }
    setMessage(res.message)
  }

  async function handlePurge(){
    const res = await fetch(`/api/groups/purge/${props.groupData.id}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      }
    })
      .then(r => r.json())
      .catch((err) => {
        console.error(err)
      })
    if (res.success) {
      setSuccess(true)
      setTimeout(()=>{
        router.push(`/groups`)
      },2000)
    }
    setMessage(res.message)
  }
  

  





  return (
    <div >
      <div className="w-full max-w-md m-auto md:p-2 md:m-0">
        {message &&

          <div className={`border ${!success?"border-red-400 text-red-700 bg-red-100 ":"border-green-400 text-green-700 bg-green-100"} px-4 py-3 rounded relative my-3`}>
            <span className="block sm:inline">{message}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <svg onClick={() => setMessage('')} className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
            </span>
          </div>
        }


        <form className="w-full max-w-md"
          onSubmit={handleSubmit(handleEdit)}
        >


          <div className=" mb-6">
            <div className="">
              <label className="block text-gray-500 font-bold  mb-1  pr-4" htmlFor="inline-group-name">
                Name</label>
            </div>
            <div className="">
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




          <div className=" mb-6">
            <div className="">
              <label className="block text-gray-500 font-bold  mb-1  pr-4" htmlFor="inline-about">
                Description</label>
            </div>
            <div className="">
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




          <div className=" mb-6">
            <div className="">
              <label className="block text-gray-500 font-bold " htmlFor="inline-enterKey">
                Enter Key</label>
            </div>
            <div className="">
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




          <div className="">
            <div className=""></div>
            <div className=" flex items-center justify-between">
              <button className=" shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
                Save
              </button>
              <div className="">
                
              </div>
              <button className="text-red-500 bg-red-100 text-xs"
              onClick={()=>{handlePurge()}}
              >
                delete group
              </button>
            </div>
          </div>



        </form>
      </div>
    </div>

  )
}


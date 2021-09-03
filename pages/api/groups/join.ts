import { getSession } from "next-auth/client"
import type {NextApiResponse, NextApiRequest} from 'next'
import prisma from '../../../lib/prisma'

export default async (req:NextApiRequest, res:NextApiResponse) => {
  const session = await getSession({ req })
  /*
  console.log(session)
  {
    user: {
      name: 'qq Gma',
      email: 'qq@gmail.com',
      image: 'https://lh3.googleusercontent.com/a-/32423r232f'
    },
    accessToken: '6ba4123422304c740123482806c5eeb15c33f1234r3220399',
    expires: '2021-10-03T05:09:59.907Z',
    id: 1111111
  }
  */


 //! JOIN GROUP LOGIC
  res.status(200).end()
}
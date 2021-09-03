import { getSession } from "next-auth/client"
import type { NextApiResponse, NextApiRequest } from 'next'
import prisma from '../../../lib/prisma'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  const { name, enterKey } = req.body

  //* JOIN-GROUP LOGIC

  function invalidData(m) {
    this.message = m
    this.name = 'invalidData'
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      },
    })
    const group = await prisma.group.findUnique({
      where: {
        name: name
      }
    })
    if (user && group) {
      if (group.authorId == user.id) throw Error("you're already an author")
      if (group.enterKey != enterKey) throw Error("invalid enter key")
      const updateGroup = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          groupsEnrolled: {
            connect: {
              id: group.id,
            },
          },
        },
      })
        .then((data) => {
          console.log(data)
          res.send({
            success: true,
            groupName: name
          })
          res.status(200).end()
        })
    }
    else {
      throw invalidData('incorrect user/group')
    }



  } catch (err) {
    res.send({
      message: `An error occurred: ${err.message}`
    })
    console.log(err)

    res.status(400).end()

  }
}


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
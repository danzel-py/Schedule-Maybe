import { getSession } from "next-auth/client"
import type { NextApiResponse, NextApiRequest } from 'next'
import prisma from '../../../lib/prisma'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  const {name, about, enterKey} = req.body

  //* CREATE-GROUP LOGIC

  
  try{
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      },
    })
    if(user){
      const newGroup = await prisma.group.create({
        data:{
          name,
          about,
          enterKey,
          authorId: user.id
        }
      })
      .then((data)=>{
        console.log(data)
        res.send({
          success: true,
          groupName: name
        })
        res.status(200).end()
      })
    }



  }catch(err){
    if(err.code == 'P2002'){
      res.send({
        message: "Group name taken! Please try other name"
      })
    }
    else{
      res.send({
        message: "An error occurred"
      })
      console.log(err)
    }
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
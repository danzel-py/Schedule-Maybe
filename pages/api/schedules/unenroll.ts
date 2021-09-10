import { getSession } from "next-auth/client"
import type { NextApiResponse, NextApiRequest } from 'next'
import prisma from '../../../lib/prisma'

// ! unenroll SCHEDULE BY ID
/*
  * on success send success
  * send message
  */

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  console.log(session)
  const { id } = req.body


  try {
    const targetSchedule = await prisma.schedule.findUnique({
      where:{
        id
      }
    })

    if(!targetSchedule){
      throw Error("invalid schedule")
    }

    if(targetSchedule.authorId == session.id){
      throw Error("u're an author, can't unenroll")
    }

    await prisma.schedule.update({
      where:{
        id
      },
      data:{
        users:{
          disconnect:[
            {id: session.id}
          ]
        }
      }
    }).catch((err)=>{
      console.log(err)
      throw Error("db update error")
    })

    res.send({
      message: "unenroll success",
      success: true
    })


  } catch (err) {
    console.log(err)
    res.send({
      message: err.message
    })

    res.status(400).end()

  }
  
}


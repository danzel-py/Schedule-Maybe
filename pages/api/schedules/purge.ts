import { getSession } from "next-auth/client"
import type { NextApiResponse, NextApiRequest } from 'next'
import prisma from '../../../lib/prisma'

// ! PURGE SCHEDULE BY ID

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  const { id } = req.body


  try {
    const targetSchedule = await prisma.schedule.findUnique({
      where:{
        id
      },include:{
        author: true
      }
    })

    if(!targetSchedule){
      throw Error("invalid schedule")
    }

    if(targetSchedule.author.email != session.user.email){
      throw Error("u're not an author")
    }

    await prisma.schedule.delete({
      where:{
        id
      }
    }).catch((err)=>{
      console.log(err)
      throw Error("db delete error")
    })

    res.send({
      message: "purgatory success",
      success: true
    })


  } catch (err) {
    res.send({
      message: err.message
    })
    console.log(err)

    res.status(400).end()

  }
  /*
  * on success send success
  * send message
  */
}


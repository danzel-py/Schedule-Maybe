import { getSession } from "next-auth/client"
import type { NextApiResponse, NextApiRequest } from 'next'
import prisma from '../../../../lib/prisma'
import { getDateFromString } from "../../../../helpers/datetime"

// ! UPDATE PORTABLE SCHEDULE
/*
* on success send success
*/

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  const { name, date, startTime, endTime, description, id, link } = req.body

  try {
    if(!session){
      throw Error("not logged in")
    }

    const schedule = await prisma.schedule.findUnique({
      where:{
        id
      },
      include:{
        author: true
      }

    })

    const startTimeObj = getDateFromString(date, startTime)
    const endTimeObj = getDateFromString(date, endTime)

    if(schedule.author.id === session.id){
      const newSchedule = await prisma.schedule.update({
        where:{
          id
        },
        data:{
          name,
          startTime: startTimeObj,
          endTime: endTimeObj,
          description,
          ...(link && {link})
        }
      })

      if(!newSchedule){
        throw Error("failed creating schedule")
      }
      
      res.send({
        message: "Success!",
        success: true
      })
    }else{
      throw Error("not eligible")
    }
  } catch (err) {
    console.log(err)
    res.send({
      message: err.message
    })
  }

  


}
import { getSession } from "next-auth/client"
import type { NextApiResponse, NextApiRequest } from 'next'
import prisma from '../../../../lib/prisma'
import { getDateFromString } from "../../../../helpers/datetime"

// ! UPDATE SCHEDULE

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  const { groupName } = req.query
  const { name, date, startTime, endTime, description,id, link } = req.body

  try {
    if(!session){
      throw("who r u")
    }
    if (typeof groupName == 'string') {
      const group = await prisma.group.update({
        where: {
          name: groupName
        },
        data:{
          updatedAt: new Date()
        },
        include: {
          users: true,
          author: true
        }
      })
      
      if(!group){
        throw Error("invalid group request")
      }
      
      const user = await prisma.user.findUnique({
        where: {
          email: session.user.email
        }
      })

      const schedule = await prisma.schedule.findUnique({
        where:{
          id
        },
        include:{
          author:true
        }
      })
      if(schedule.author.email != session.user.email || group.author.email != session.user.email){
        throw Error("not eligible")
      }
      if(!user){
        throw Error("invalid user/token")
      }

      const startTimeObj = getDateFromString(date, startTime)
      const endTimeObj = getDateFromString(date, endTime)

      if (group) {
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
      }
    }
    else {
      throw Error("invalid query")
    }
  } catch (err) {
    console.log(err)
    res.send({
      message: err.message
    })
  }

  /*
  
  * on success send success
*/


}
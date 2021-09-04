import { getSession } from "next-auth/client"
import type { NextApiResponse, NextApiRequest } from 'next'
import prisma from '../../../../lib/prisma'
import { getDateFromString } from "../../../../helpers/datetime"
import { getScheduleTypes } from "../../../../interfaces/dbEnum"

// ! CREATE SCHEDULE

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  const { groupName } = req.query
  const { name, date, startTime, endTime, type, description, link, includeEveryone } = req.body

  try {
    if(!session){
      throw("who r u")
    }
    if (typeof groupName == 'string') {
      const group = await prisma.group.findUnique({
        where: {
          name: groupName
        },
        include: {
          users: true
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
      if(!user){
        throw Error("invalid user/token")
      }

      const startTimeObj = getDateFromString(date, startTime)
      const endTimeObj = getDateFromString(date, endTime)

      if (group) {
        const newSchedule = await prisma.schedule.create({
          data: {
            name: name,
            type: getScheduleTypes(type),
            description,
            link: link,
            endTime: endTimeObj,
            startTime: startTimeObj,
            groupId: group.id,
            authorId: user.id,
            // users: {
            //   connect: groupMembers
            // }
          }
        })
        if(!newSchedule){
          throw Error("failed creating schedule")
        }
        if(includeEveryone && group.users){
          const groupMembers = group.users.map((user) => {
            if(user.email != session.user.email){
              return {
                id: user.id
              }
            }
          })
          const n = await prisma.schedule.update({
            where:{
              id: newSchedule.id
            },
            data: {
              users: {
                connect: groupMembers
              },
            },
          })
          if(!n){
            throw Error("failed connecting schedule")
          }
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
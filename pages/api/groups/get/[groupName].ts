import { getSession } from "next-auth/client"
import type { NextApiResponse, NextApiRequest } from 'next'
import prisma from '../../../../lib/prisma'
import { getDaysLater, getFirstDayMonth } from "../../../../helpers/datetime"


export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  const { groupName } = req.query

// 2021-09-03T03:04:04.727Z

  try{
    if(typeof groupName == 'string'){
      const group = await prisma.group.findUnique({
        where:{
          name: groupName
        },
        include:{
          author: true,
          schedules: {
            where: { // get from first month so we can display month's schedule
              createdAt: {
                gte: getFirstDayMonth(),
                lt:  getDaysLater(40)
              },
            }
          }
        }
      })
      if(!group){
        throw Error("group not found")
      }
      res.send({
        groupData: {
          name: group.name,
          about: group.about,
          author: {
            name: group.author.name,
            image: group.author.image,
            username: group.author.username
          },
          admin: session.user.email == group.author.email,
          schedules: group.schedules
        }
      })
    }
    else{
      throw Error("invalid query")
    }
  }catch(err){
    res.send({
      groupNotFound: true
    })
  }
  
  /*
  
  * on success send data
  res.send({
    groupData: groupName
  })

  * on fail deliver groupNotFound: true
*/

  
}
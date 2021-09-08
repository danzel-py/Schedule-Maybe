import { getSession } from "next-auth/client"
import type { NextApiResponse, NextApiRequest } from 'next'
import prisma from '../../../../lib/prisma'
import { getDaysLater, getFirstDayMonth } from "../../../../helpers/datetime"

// ^ GET GROUP

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  const { groupName } = req.query

// 2021-09-03T03:04:04.727Z

  try{
    if(!session){
      throw Error("who r u")
    }
    if(typeof groupName == 'string'){
      const group = await prisma.group.findUnique({
        where:{
          name: groupName
        },
        include:{
          author: true,
          schedules: {
            include:{
              author : true
            }
          },
          users: true
        }
      })
      if(!group){
        throw Error("group not found")
      }

      let tmp = group.schedules.filter(schedule=>
        schedule.startTime >= getDaysLater(-40) && schedule.startTime < getDaysLater(40) 
      )
      tmp.sort((a,b)=>{
        if(a.startTime > b.startTime){
          return 1
        }
        if(a.startTime < b.startTime){
          return -1
        }
        return 0
      })
      group.schedules = tmp


      const checkMember = (e)=> e.email == session.user.email

      res.send({
        groupData: {
          name: group.name,
          about: group.about,
          author: {
            id: group.author.id,
            name: group.author.name,
            image: group.author.image,
            username: group.author.username,
            email: group.author.email
          },
          admin: session.user.email == group.author.email,
          member: group.users.some(checkMember), 
          schedules: group.schedules
        }
      })
    }
    else{
      throw Error("invalid query")
    }
  }catch(err){
    res.send({
      message: err.message,
      groupNotFound: true
    })
  }
  
  /*
  
  * on success send groupData

  * on fail deliver groupNotFound: true
*/

  
}
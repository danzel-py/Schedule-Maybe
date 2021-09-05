import { getSession } from "next-auth/client"
import type { NextApiResponse, NextApiRequest } from 'next'
import prisma from '../../../../lib/prisma'
import { omit } from '../../../../helpers/object'

// * GET USER

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  const { getUserParam } = req.query  
  let inGroups = getUserParam == "groups"
  let inSchedules = getUserParam == "schedules"
  if(getUserParam == "all"){
    inGroups = true
    inSchedules = true
  }

  try{
    const user = await prisma.user.findUnique({
      where:{
        email: session.user.email
      },
      include:{
        accounts: true,
        ...(inGroups && {groupsAuthored: true, groupsEnrolled: true}),
        ...(inSchedules && {schedulesEnrolled: true, schedulesAuthored: true})
      }
    })

    const filteredUser = omit(user,'emailVerified','createdAt','updatedAt','failedAttempts','accounts')
    if(inGroups){
      const filteredGroups = user.groupsEnrolled.map(element => {
        return omit(element, 'enterKey')
      });
      console.log(filteredGroups)
      filteredUser.groupsEnrolled = filteredGroups
    }
    console.log(filteredUser)

    res.send({
      user: filteredUser

    })
    
  }catch(err){
    console.log(err)
    res.send({
      message: err.message
    })
  }


}
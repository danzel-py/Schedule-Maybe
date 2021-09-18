import { getSession } from "next-auth/client"
import type { NextApiResponse, NextApiRequest } from 'next'
import prisma from '../../../../lib/prisma'

// * Kick member from Group
// success on success
// message

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  const {memberId } = req.body
  const { groupId } = req.query
  

  try{
    if(typeof groupId == 'string'){
      const groupGet = await prisma.group.findUnique({
        where:{
          id: parseInt(groupId)
        },include:{schedules:true}
      })
      
      if(!groupGet || session.id != groupGet.authorId){
        // not author but kick self
        if(session.id == memberId){
          // ok
        }else{
          throw Error("invalid credentials")
        }
      }

      const unenrollSchedules = await prisma.user.update({
        where:{
          id: memberId
        },
        data:{
          schedulesEnrolled:{
            disconnect: groupGet.schedules.map((sch)=>{
              return {id: sch.id}
            })
          }
        }
      })

      const groupUpdate = await prisma.group.update({
        where:{
          id: groupGet.id
        },
        data:{
          users:{
            disconnect:[
              {id: memberId}
            ]
          }
        }
      })
      
      res.send({
        message: "update success",
        success: true
      })
    }else{
      throw Error("false query")
    }
    
  }catch(err){
    console.log(err)
    res.send({
      message: err.message,
    })
  }


}
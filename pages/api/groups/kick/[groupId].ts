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
  console.log(req)
  

  try{
    if(typeof groupId == 'string'){
      const groupGet = await prisma.group.findUnique({
        where:{
          id: parseInt(groupId)
        }
      })
      
      if(!groupGet || session.id != groupGet.authorId){
        throw Error("invalid credentials")
      }

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
    console.log(err.code, "CODE")
    res.send({
      message: err.message,
    })
  }


}
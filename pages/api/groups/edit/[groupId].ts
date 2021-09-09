import { getSession } from "next-auth/client"
import type { NextApiResponse, NextApiRequest } from 'next'
import prisma from '../../../../lib/prisma'

// * UPDATE Group
// success, groupName on success
// message

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  const {name, enterKey, about } = req.body
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
          name,
          about,
          enterKey
        }
      })
      
      res.send({
        message: "update success",
        groupName: groupUpdate.name,
        success: true
      })
    }else{
      throw Error("false query")
    }
    
  }catch(err){
    console.log(err.code, "CODE")
    if(err.code == 'P2002'){
      res.send({
        message: "group name taken",
      })
    }
    res.send({
      message: err.message,
    })
  }


}
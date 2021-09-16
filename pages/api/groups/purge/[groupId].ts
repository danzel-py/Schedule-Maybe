import { getSession } from "next-auth/client"
import type { NextApiResponse, NextApiRequest } from 'next'
import prisma from '../../../../lib/prisma'

// ! PURGE GROUP

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  const { groupId } = req.query
  
  try{
    if(typeof groupId == "string" ){

      const group = await prisma.group.findUnique({
        where : {
          id: parseInt(groupId)
        }
      })

      if(group && group.authorId == session.id){
        await prisma.schedule.deleteMany({
          where:{
            groupId: group.id
          }
        })
        await prisma.group.delete({
          where: {
            id: group.id
          }
        })
        res.send({
          message: "Purgatory success.",
          success: true
        })
      }else{
        throw Error("an error has occurred")
      }
      

    }
      
  }catch(err){
    res.send({
      message: `An error occurred: ${err.message}`
    })
  }

  
}
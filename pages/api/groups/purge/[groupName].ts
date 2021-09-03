import { getSession } from "next-auth/client"
import type { NextApiResponse, NextApiRequest } from 'next'
import prisma from '../../../../lib/prisma'
import { getDaysLater, getFirstDayMonth } from "../../../../helpers/datetime"

// ! PURGE GROUP

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  const { groupName } = req.query
  
  try{
    if(typeof groupName == "string" ){

      const group = await prisma.group.findUnique({
        where : {
          name: groupName
        },
        include:{
          author: true
        }
      })

      if(group && group.author.email == session.user.email){
        const purgeGroup = await prisma.group.delete({
          where: {
            name: groupName
          }
        })
        res.send({
          message: "Purgatory success.",
          success: true
        })
      }else{
        throw Error("invalid credential")
      }
      

    }
      
  }catch(err){
    res.send({
      message: `An error occurred: ${err.message}`
    })
  }

  
}
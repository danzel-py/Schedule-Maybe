import { getSession } from "next-auth/client"
import type { NextApiResponse, NextApiRequest } from 'next'
import prisma from '../../../lib/prisma'

// * UPDATE USER

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  const {name, username, image } = req.body
  

  try{
    const userUpdate = await prisma.user.update({
      where:{
        email: session.user.email
      },
      data:{
        name,
        username,
        image
      }
    })

    if(!userUpdate){
      throw Error("fail updating")
    }

    res.send({
      message: "update success",
      success: true
    })
    
  }catch(err){
    console.log(err)
    res.send({
      message: err.message
    })
  }


}
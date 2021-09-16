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
  if (getUserParam == "all") {
    inGroups = true
    inSchedules = true
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.id
      },
      include: {
        accounts: true,
        ...(inGroups && { 
          groupsAuthored: {
            include: {
              users: true
            }
          }, 
          groupsEnrolled: {
            include: {
              users: true
            }
          }, 
        }),
        ...(inSchedules && { schedulesEnrolled: true, schedulesAuthored: true })
      }
    })
    // console.log(user);

    let otherGroups;
    if (inGroups) {
      otherGroups = await prisma.group.findMany({
        where: {
          public:true,
          NOT:
          {
            OR:[
              {
                users: {
                  some: {
                    id: session.id
                  }
                }
              },
              {
                authorId: session.id
              }
            ]
          }
        },
        include:{
          users:true
        }
      })
    }

    const filteredUser = omit(user, 'emailVerified', 'createdAt', 'updatedAt', 'failedAttempts', 'accounts')
    if (inGroups) {
      const filteredGroups = user.groupsEnrolled.map(group => {
        group['count'] = group.users?.length + 1
        return omit(group, 'enterKey', 'users')
      });
      filteredUser.groupsEnrolled = filteredGroups
      filteredUser.groupsAuthored = filteredUser.groupsAuthored.map(group=>{
        group['count'] = group.users?.length + 1
        return omit(group, 'users')
      })
    }
    // console.log(filteredUser);
    res.send({
      user: filteredUser,
      ...(inGroups && {otherGroups: otherGroups.map(group => {
        group['count'] = group.users?.length + 1
        return omit(group, 'enterKey', 'users')
      })})
    })

  } catch (err) {
    console.log(err)
    res.send({
      message: err.message
    })
  }


}
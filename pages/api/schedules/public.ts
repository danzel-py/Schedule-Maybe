import { getSession } from "next-auth/client"
import type { NextApiResponse, NextApiRequest } from 'next'
import prisma from '../../../lib/prisma'

// * GET public schedules
/*
schedules[], success on success
message
*/

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession({ req })
    if (!session) {
      throw Error("invalid login")
    }
    const user = await prisma.user.findUnique({
      where: {
        id: session.id,
      },
      include: {
        groupsAuthored: {
          select: {
            schedules: true
            // {
            //   select: {
            //     id: true,
            //     groupId: true,
            //     authorId: true,
            //   }
            // }
          }
        },
        groupsEnrolled: {
          select: {
            schedules: true
            // {
            //   select: {
            //     id: true,
            //     groupId: true,
            //     authorId: true
            //   }
            // }
          }
        }
      }
    })
    /*
        user = {
      id: 6,
      name: 'Totally Mango',
      about: null,
      username: '78e4a427-e1c4-4555-9081-b590e1694f33',
      email: 'notwatermango@gmail.com',
      image: 'https://lh3.googleusercontent.com/a/AATXAJzOnriIxZ94bvcjVNsiXSfGsvTn2qrMr1O--ubf=s96-c',
      emailVerified: null,
      createdAt: 2021-09-16T03:45:27.358Z,
      updatedAt: 2021-09-16T03:45:27.359Z,
      failedAttempts: 0,
      groupsAuthored: [ { schedules: [] }, { schedules: [Array] } ],
      groupsEnrolled: []
      }
    */
    const schedules = [];
    user.groupsAuthored.forEach(group => {
      group.schedules.forEach(schedule=>{
        if(schedule.authorId!=session.id){
          schedules.push(schedule)
        }
      })
    })
    user.groupsEnrolled.forEach(group=>{
      group.schedules.forEach(schedule=>{
        if(schedule.authorId!=session.id){
          schedules.push(schedule)
        }
      })
    })
    console.log(schedules)
    // schedules
    /*
    [
  {
    id: 24,
    type: 'MEETING',
    name: 'Parents Day Sesi Jurusan',
    description: 'Buat ortu, cek email',
    link: 'https://binus.zoom.us/meeting/register/tJcoc-GrqzsrG9V1HDlCmclqzuGBTzJsWpez',
    startTime: 2021-09-25T09:00:00.528Z,
    endTime: 2021-09-25T10:00:00.528Z,
    createdAt: 2021-09-16T04:24:49.330Z,
    updatedAt: 2021-09-17T15:11:08.530Z,
    authorId: 6,
    groupId: 20
  },
  {
    id: 27,
    type: 'LECTURE',
    name: 'Academic Experience',
    description: 'Welcome to Computer Science Family - Virtual Class\n',
    link: 'https://newbinusmaya.binus.ac.id/lms/course/ac50d878-15d0-4d05-85d8-2ddc6c5dff94/session/f7e5e3f1-87ff-4e2f-8ded-816075e77b59',
    startTime: 2021-09-22T02:20:00.055Z,
    endTime: 2021-09-22T04:20:00.055Z,
    createdAt: 2021-09-17T15:17:31.058Z,
    updatedAt: 2021-09-17T15:17:31.059Z,
    authorId: 6,
    groupId: 20
  },
  {
    id: 29,
    type: 'LECTURE',
    name: 'Academic Experience',
    description: 'Meet Your Academic Advisor (Computer Science) - Virtual Class',
    link: 'https://newbinusmaya.binus.ac.id/lms/course/9f599a5e-aa5a-410f-b41b-64af2e378e9f/session/d18b696e-98c4-469c-9bc6-a9f98e946b80',
    startTime: 2021-09-23T02:20:00.999Z,
    endTime: 2021-09-23T03:50:00.999Z,
    createdAt: 2021-09-17T15:20:29.001Z,
    updatedAt: 2021-09-17T15:20:29.002Z,
    authorId: 6,
    groupId: 20
  }
]
   */
  res.send({
    success: true,
    message: "ok here's ur schedules[]",
    schedules
  })



    







  } catch (err){
    console.log(err);
    res.send({
      message: err.message
    })

  }


}
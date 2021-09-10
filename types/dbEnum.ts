import { ScheduleType } from ".prisma/client";

/**
 * @param {string}  scheduleType -  "none", "lecture", "webinar", "meeting", "studyGroup", "event", "other"
 * @return {ScheduleType} enum for ScheduleType 
 */
export function getScheduleTypes(x:string){
  switch (x) {
    case "lecture":
      return ScheduleType.LECTURE
      break;
    case "webinar":
      return ScheduleType.WEBINAR
      break;
    case "meeting":
      return ScheduleType.MEETING
      break;
    case "studyGroup":
      return ScheduleType.STUDYGROUP
      break;
    case "event":
      return ScheduleType.EVENT
      break;
    case "webinar":
      return ScheduleType.WEBINAR
      break;
    default:
      return ScheduleType.OTHER
      break;
  }
}
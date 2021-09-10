export type IFormCreateGroup = {
  name: string
  about: string
  enterKey: string
  public?: boolean
}

export type IFormJoinGroup = {
  name: string
  enterKey: string
}

export type IFormCreateSchedule = {
  name: string
  date: string
  startTime: string
  endTime: string
  type?: string
  description?: string
  link?: string
  includeEveryone: boolean
}

// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

export type IUser = {
  id: number
  name: string
}

export type IFormCreateGroup = {
  name: string
  about: string
  enterKey: string
  public: boolean
}

export type IFormJoinGroup = {
  name: string
  enterKey: string
}

/**
 * Created by Jacob Xie on 2/3/2021
 */

declare namespace InnAPI {

  export interface Update {
    id: string
    date: string
    tags?: Tag[]
    title: string
    data: string
    createdAt?: string
    updatedAt?: string
  }

  export interface Tag {
    id: string
    updates?: Update[]
    name: string
    description?: string
    color?: string
  }
}


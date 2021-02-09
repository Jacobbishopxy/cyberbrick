/**
 * Created by Jacob Xie on 2/3/2021
 */

import {request} from "umi"

const base = "/api/inn"

// Update

export const getAllUpdate = async (): Promise<InnAPI.Update[]> =>
  request(`${base}/updates`)

export const getUpdateById = async (id: string): Promise<InnAPI.Update> =>
  request(`${base}/update?id=${id}`)

export const saveUpdate = async (update: InnAPI.Update): Promise<any> =>
  request(`${base}/update`, {
    method: "post",
    data: update
  })

export const deleteUpdate = async (id: string): Promise<any> =>
  request(`${base}/update?id=${id}`, {
    method: "delete"
  })

export const getLatestUpdate = async (pagination?: [number, number]): Promise<InnAPI.Update[]> => {
  let path = `${base}/getLatestUpdate`
  if (pagination)
    path += `?pagination=${pagination.join(",")}`
  return request(path)
}

// Tag

export const getAllTag = async (): Promise<InnAPI.Tag[]> =>
  request(`${base}/tags`)

export const getTagById = async (id: string): Promise<InnAPI.Tag> =>
  request(`${base}/tag?id=${id}`)

export const saveTag = async (tag: InnAPI.Tag): Promise<any> =>
  request(`${base}/tag`, {
    method: "post",
    data: tag
  })

export const deleteTag = async (id: string): Promise<any> =>
  request(`${base}/tag?id=${id}`, {
    method: "delete"
  })

export const modifyTags = async (tags: InnAPI.Tag[]): Promise<any> =>
  request(`${base}/modifyTags`, {
    method: "post",
    data: tags
  })


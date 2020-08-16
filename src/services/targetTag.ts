/**
 * Created by Jacob Xie on 8/16/2020.
 */

import request from "umi-request"

export interface Target {
  id?: number
  title: string
  text: string
  tags?: Tag[]
}

export interface Tag {
  name: string
  description?: string | null
  targets?: Target[]
}

export const getTargets = async () =>
  request<API.TargetType[]>("/api/tt/targets")

export const getTargetById = async (id: number) =>
  request<API.TargetType>(`/api/tt/target?id=${ id }`)

export const saveTarget = async (target: Target) =>
  request<API.TargetType>("/api/tt/target", {
    method: "POST",
    data: target
  })

export const deleteTarget = async (id: number) =>
  request<API.TargetType>("/api/tt/target", {
    method: "DELETE",
    data: id
  })

export const getTags = async (relationRequire?: boolean) => {
  let s: string
  if (relationRequire)
    s = "/api/tt/tags?relationRequired=true"
  else
    s = "/api/tt/tags"

  return request<API.TagType[]>(s)
}

export const getTagByName = async (name: string) =>
  request<API.TagType>(`/api/tt/tag?name=${ name }`)

export const saveTag = async (tag: Tag) =>
  request<API.TagType>("/api/tt/tag", {
    method: "POST",
    data: tag
  })

export const deleteTag = async (name: string) =>
  request<API.TagType>("/api/tt/tag", {
    method: "DELETE",
    data: name
  })


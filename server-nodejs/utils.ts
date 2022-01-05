/**
 * Created by Jacob Xie on 8/29/2020.
 */

import {Equal, In, Like} from "typeorm"

// misc
export type QueryStr = string | undefined

// query filters
export const whereNameEqual = (v: string) => ({where: {name: Equal(v)}})
export const whereNameLike = (v: string) => ({where: {name: Like(`%${v}%`)}})
export const whereIdEqual = (v: string) => ({where: {id: Equal(v)}})
export const whereTabIdEqual = (v: string) => ({where: {tabId: Equal(v)}})
export const whereIdsIn = (v: string[]) => ({where: {id: In(v)}})
export const whereTypeEqual = (v: string) => ({where: {type: Equal(v)}})

// query orders
export type OrderType = "ASC" | "DESC"
export const orderByDate = (orderType: OrderType) => ({order: {date: orderType}})
export const orderByName = (orderType: OrderType) => ({order: {name: orderType}})

// string extract
export const regSkip = new RegExp("^\\((\\d+),")
export const regTake = new RegExp(",(\\d+)\\)$")
export const regPagination = new RegExp("^\\((\\d+),(\\d+)\\)$")
export const regArrayLike = new RegExp("^(\\w+(,\\w+)*)|(\\w+)")

export const paginationSkip = (pagination: QueryStr) => {
  if (!pagination)
    return undefined
  const s = regSkip.exec(pagination)
  if (s === null)
    return undefined
  return +s[1]
}

export const paginationTake = (pagination: QueryStr) => {
  if (!pagination)
    return undefined
  const t = regTake.exec(pagination)
  if (t === null)
    return undefined
  return +t[1]
}

export const paginationGet = (pagination: [number, number] | undefined) => {
  if (pagination) {
    return {
      skip: pagination[0],
      take: pagination[1]
    }
  }
  return {}
}

export const paginationExtract = (pagination: QueryStr) => {
  if (pagination) {
    const s = paginationSkip(pagination)
    const t = paginationTake(pagination)
    if (s && t) return [s, t] as [number, number]
  }
  return undefined
}

export const arrayLikeGet = (arr: QueryStr) => {
  if (arr) return regArrayLike.exec(arr)
  return undefined
}


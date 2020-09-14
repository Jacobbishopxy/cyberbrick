/**
 * Created by Jacob Xie on 8/29/2020.
 */

import { Request, Response } from "express"
import { validationResult, ValidationChain } from "express-validator"
import { Equal, In } from "typeorm"

// misc
export type QueryStr = string | undefined

export interface OrmRoute {
  path: string,
  method: string,
  check?: ValidationChain[],
  action: Function
}

// HTML status
export enum HTMLStatus {
  SUCCESS_QUERY = 200,
  SUCCESS_MODIFY = 201,
  SUCCESS_DELETE = 204,
  NOT_MODIFY = 304,
  FAIL_REQUEST = 400,
  FAIL_OPERATION = 404,
  FAIL_NOT_ALLOWED = 405,
}

// query filters
export const whereNameEqual = (n: string) =>
  ({ where: { name: Equal(n) } })

export const whereIdEqual = (n: string) =>
  ({ where: { id: Equal(n) } })

export const whereNamesIn = (n: string) => {
  const ns = n.split(",")
  return { where: { name: In(ns) } }
}

export const whereStringIdsIn = (ids: string) => {
  const idsArr = ids.split(",").map(i => +i)
  return { where: { id: In(idsArr) } }
}

export const whereIdsIn = (ids: string[]) =>
  ({ where: { id: In(ids) } })

// query orders
export type OrderType = "ASC" | "DESC"

export const orderByDate = (orderType: OrderType) =>
  ({ order: { date: orderType } })

export const orderByName = (orderType: OrderType) =>
  ({ order: { name: orderType } })

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

export const paginationGet = (pagination: QueryStr) => {
  let pg = {}
  if (pagination) {
    const s = paginationSkip(pagination)
    const t = paginationTake(pagination)
    if (s) pg = { ...pg, skip: s }
    if (t) pg = { ...pg, take: t }
  }
  return pg
}

export const arrayLikeGet = (arr: QueryStr) => {
  if (arr) return regArrayLike.exec(arr)
  return undefined
}

/**
 * request error validator
 */
export function expressErrorsBreak(req: Request, res: Response) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() })
    return true
  }
  return false
}

// express request checkers
export const messageRequestQuery = (d: string) => `${ d } is required in request query!`
export const messageRequestBody = (d: string) => `${ d } is required in request body!`

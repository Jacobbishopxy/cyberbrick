/**
 * Created by Jacob Xie on 8/29/2020.
 */

import { Request, Response } from "express"
import { validationResult, ValidationChain, query, body } from "express-validator"
import { Equal, In } from "typeorm"

// misc
export type QueryStr = string | undefined

export interface OrmRoute {
  path: string,
  method: "get" | "put" | "post" | "delete",
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

export const paginationGet2 = (pagination: [number, number] | undefined) => {
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

/**
 * request error validator
 */
export function expressErrorsBreak(req: Request, res: Response) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(HTMLStatus.FAIL_REQUEST).json({ errors: errors.array() })
    return true
  }
  return false
}

// express request checkers
export const messageRequestQuery = (d: string) => `${ d } is required in request query!`
export const messageRequestBody = (d: string) => `${ d } is required in request body!`

/**
 * general query param check
 */
export const queryFieldCheck = (field: string) =>
  query(field, messageRequestQuery(field)).exists()

/**
 * general query optional param check
 */
export const queryOptionalFieldCheck = (field: string, fn?: (v: string) => boolean) => {
  const raw = query(field, messageRequestQuery(field)).optional()
  if (fn) return raw.custom(fn).exists()
  return raw.exists()
}

/**
 * general body field check
 */
export const bodyFieldCheck = (field: string) =>
  body(field, messageRequestBody(field)).isLength({ min: 1 }).exists()

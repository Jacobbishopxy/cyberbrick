/**
 * Created by Jacob Xie on 8/19/2020.
 */

import { Request, Response } from "express"
import { query, validationResult } from "express-validator"
import { Equal, In } from "typeorm"


export type QueryStr = string | undefined

// db name
export const article = "article"
export const category = "category"
export const gallery = "gallery"
export const author = "author"
export const tag = "tag"

// column name
export const tags = "tags"
export const unionTags = "unionTags"
export const name = "name"
export const articles = "articles"
export const categories = "categories"
export const date = "date"
export const id = "id"
export const description = "description"

// joint column name
export const articleId = `${ article }.${ id }`
export const articleCategory = `${ article }.${ category }`
export const articleAuthor = `${ article }.${ author }`
export const articleTags = `${ article }.${ tags }`
export const categoryName = `${ category }.${ name }`
export const categoriesUnionTags = `${ categories }.${ unionTags }`
export const tagName = `${ tag }.${ name }`
export const articlesAuthor = `${ articles }.${ author }`
export const articlesTags = `${ articles }.${ tags }`
export const articlesCategory = `${ articles }.${ category }`
export const articlesCategoryTags = `${ articles }.${ category }.${ tags }`
export const tagArticles = `${ tag }.${ articles }`
export const tagCategories = `${ tag }.${ categories }`
export const tagsArticles = `${ tags }.${ articles }`
export const tagsAuthor = `${ tags }.${ author }`
export const authorName = `${ author }.${ name }`
export const authorDescription = `${ author }.${ description }`
export const authorArticles = `${ author }.${ articles }`

// query filters
export const whereNameEqual = (n: string) =>
  ({ where: { name: Equal(n) } })

export const whereNamesIn = (n: string) => {
  const ns = n.split(",")
  return { where: { name: In(ns) } }
}

export const whereStringIdsIn = (ids: string) => {
  const idsArr = ids.split(",").map(i => +i)
  return { where: { id: In(idsArr) } }
}

export const whereIdsIn = (ids: number[]) =>
  ({ where: { id: In(ids) } })

// query orders
type OrderType = "ASC" | "DESC"

export const orderByDate = (orderType: OrderType) =>
  ({ order: { date: orderType } })

export const orderByName = (orderType: OrderType) =>
  ({ order: { name: orderType } })

// misc
const regSkip = new RegExp("^\\((\\d+),")
const regTake = new RegExp(",(\\d+)\\)$")
const regPagination = new RegExp("^\\((\\d+),(\\d+)\\)$")
const regArrayLike = new RegExp("^(\\w+(,\\w+)*)|(\\w+)")

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
export const queryIdCheck =
  query(id, `${ id } is required!`)
    .exists()

export const queryIdsCheck =
  query("ids", "ids is required!")
    .exists()

export const queryNameCheck =
  query(name, `${ name } is required!`)
    .exists()

export const queryNamesCheck =
  query("names", "names is required!")
    .exists()

export const queryCategoryNameCheck =
  query(categoryName, `${ categoryName } is required!`)

export const queryTagNameCheck =
  query("tagName", "tagName is required!")

export const queryOptionalTagNamesCheck =
  query("tagNames", "tagNames should like `?tagNames=Scala,Typescript`!")
    .optional()
    .custom((p: string) => regArrayLike.exec(p) !== null)

export const queryOptionalPaginationCheck =
  query("pagination", "pagination should like (5,10), meaning skip 5 and take 10")
    .optional()
    .custom((p: string) => regPagination.exec(p) !== null)

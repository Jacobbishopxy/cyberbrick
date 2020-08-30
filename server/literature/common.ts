/**
 * Created by Jacob Xie on 8/19/2020.
 */

import { body, query } from "express-validator"

import * as utils from "../utils"

// table name
export const article = "article"
export const category = "category"
export const gallery = "gallery"
export const author = "author"
export const tag = "tag"
export const config = "config"

// column name
export const tags = "tags"
export const unionTags = "unionTags"
export const name = "name"
export const articles = "articles"
export const categories = "categories"
export const date = "date"
export const id = "id"
export const description = "description"
export const dashboardName = "dashboardName"
export const templateName = "templateName"
export const elementName = "elementName"
export const symbol = "symbol"

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

// express validator
export const queryIdCheck =
  query(id, utils.messageRequestQuery(id)).exists()

export const queryIdsCheck =
  query("ids", utils.messageRequestQuery("ids")).exists()

export const queryNameCheck =
  query(name, utils.messageRequestQuery(name)).exists()

export const queryNamesCheck =
  query("names", utils.messageRequestQuery("names")).exists()

export const queryCategoryNameCheck =
  query("categoryName", utils.messageRequestQuery("categoryName")).exists()

export const queryTagNameCheck =
  query("tagName", utils.messageRequestQuery("tagName")).exists()

export const queryOptionalTagNamesCheck =
  query("tagNames", "tagNames should like `?tagNames=Scala,Typescript`!")
    .optional()
    .custom((p: string) => utils.regArrayLike.exec(p) !== null)

export const queryOptionalPaginationCheck =
  query("pagination", "pagination should like (5,10), meaning skip 5 and take 10")
    .optional()
    .custom((p: string) => utils.regPagination.exec(p) !== null)

export const bodyNameCheck =
  body(name, utils.messageRequestBody(name)).isLength({ min: 1 }).exists()

export const bodyTagNameCheck =
  body(tagName, utils.messageRequestBody(tagName)).isLength({ min: 1 }).exists()

export const bodyCategoryCheck =
  body(category, utils.messageRequestBody(category)).isLength({ min: 1 }).exists()

export const bodyCategoriesCheck =
  body(categories, utils.messageRequestBody(categories)).exists()


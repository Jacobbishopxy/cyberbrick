/**
 * Created by Jacob Xie on 8/19/2020.
 */

import { Request, Response } from "express"
import { getRepository } from "typeorm"
// import _ from "lodash"

import * as common from "../common"
import { Category } from "../entities/Category"
// import { Tag } from "../entities/Tag"
// import { Article } from "../entities/Article"


const repo = () => getRepository(Category)

const categoryArticlesRelations = {
  relations: [
    common.articles,
    common.articlesCategory,
    common.articlesCategoryTags,
    common.articlesAuthor
  ]
}
const categoryTagsRelations = {
  relations: [
    common.tags
  ]
}
// const tagArticlesRelations = {
//   relations: [
//     common.articles
//   ]
// }


/**
 * get all categories, no relations
 */
export async function getAllCategories(req: Request, res: Response) {
  const categories = await repo().find()

  res.send(categories)
}

// todo: pagination needed, use queryBuilder!
/**
 * get articles under a category, with full article relations
 */
export async function getArticlesByCategoryName(req: Request, res: Response) {

  if (common.expressErrorsBreak(req, res)) return

  const pagination = req.query.pagination as common.QueryStr

  const cat = await repo()
    .findOne({
      ...categoryArticlesRelations,
      ...common.whereNameEqual(req.query.name as string),
      ...common.paginationGet(pagination)
    })

  res.send(cat)
}

/**
 *
 */
// export async function getArticlesByCategoryAndTagNames(req: Request, res: Response) {
//
//   if (common.expressErrorsBreak(req, res)) return
//
//   const categoryName = req.query.category as string
//   const tagNames = req.query.tags as string
//   const pagination = req.query.pagination as common.QueryStr
//
//   const cat = await repo()
//     .findOne({
//       ...categoryTagsRelations,
//       ...common.whereNameEqual(categoryName)
//     })
//
//   if (cat === undefined) {
//     res.send([])
//     return
//   }
//   const realTagsNames = cat.tags.map(i => i.name).filter(i => tagNames.includes(i))
//
//   const ts = await getRepository(Tag)
//     .createQueryBuilder(common.tag)
//     .leftJoinAndSelect(common.tagArticles, common.article)
//     .select([common.tagName, common.articleId])
//     .where(`${ common.tagName } IN (:...names)`, { names: realTagsNames })
//     .getMany()
//
//   const idsArr = ts.map(i => {
//     if (i.articles)
//       return i.articles.map(j => j.id)
//     return []
//   })
//   const commonIds = _.reduce(idsArr, (acc, arr) => _.intersection(acc, arr))
//
//   if (commonIds === undefined) {
//     res.send([])
//     return
//   }
//
//   const at = await getRepository(Article)
//     .find({
//       ...common.whereIdsIn(commonIds.join(",")),
//       ...common.paginationGet(pagination)
//     })
//
//   res.send(at)
// }

// export async function getArticlesByCategoryAndTagNames2(req: Request, res: Response) {
//
//   if (common.expressErrorsBreak(req, res)) return
//
//   const categoryName = req.query.category as string
//   const tagNames = req.query.names as string
//   const pagination = req.query.pagination as common.QueryStr
//
//   const ans = await repo()
//     .createQueryBuilder()
//     .leftJoinAndSelect(common.tagCategories, common.category)
//     .leftJoinAndSelect(common.categoryArticles, common.article)
//
// }


/**
 * get article ids under a category
 */
export async function getArticleIdsByCategoryName(req: Request, res: Response) {

  if (common.expressErrorsBreak(req, res)) return

  const cat = await repo()
    .createQueryBuilder()
    .leftJoinAndSelect(common.categoryArticles, common.article)
    .select([common.categoryName, common.articleId])
    .where(`${ common.categoryName } = :name`, { name: req.query.name as string })
    .getOne()

  const idsArr = cat!.articles.map(i => i.id)

  res.send(idsArr)
}

/**
 * get tags under a category
 */
export async function getTagsByCategoryName(req: Request, res: Response) {

  if (common.expressErrorsBreak(req, res)) return

  const cat = await repo()
    .findOne({
      ...categoryTagsRelations,
      ...common.whereNameEqual(req.query.name as string)
    })

  res.send(cat)
}

/**
 * save a category
 */
export async function saveCategory(req: Request, res: Response) {
  const rp = repo()
  const newCat = rp.create(req.body)
  await rp.save(newCat)

  res.send(newCat)
}

/**
 * delete a category
 */
export async function deleteCategory(req: Request, res: Response) {

  if (common.expressErrorsBreak(req, res)) return

  const name = req.query.name as string

  await repo()
    .createQueryBuilder()
    .delete()
    .where(`${ common.name } = :name`, { name })
    .execute()

  res.send(name)
}

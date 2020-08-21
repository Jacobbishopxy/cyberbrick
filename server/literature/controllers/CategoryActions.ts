/**
 * Created by Jacob Xie on 8/19/2020.
 */

import { Request, Response } from "express"
import { getRepository } from "typeorm"

import * as common from "../common"
import { Category } from "../entities/Category"


const repo = () => getRepository(Category)

const categoryArticlesRelations = { relations: [common.articles, common.articlesAuthor, common.articlesTags] }
const categoryTagsRelations = { relations: [common.tags] }


/**
 * get all categories, no relations
 */
export async function getAllCategories(req: Request, res: Response) {
  const categories = await repo().find()

  res.send(categories)
}

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

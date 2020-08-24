/**
 * Created by Jacob Xie on 8/19/2020.
 */

import { Request, Response } from "express"
import { getRepository } from "typeorm"
import _ from "lodash"

import * as common from "../common"
import { Category } from "../entities/Category"
// import { Tag } from "../entities/Tag"


const categoryRepo = () => getRepository(Category)
// const tagRepo = () => getRepository(Tag)

const categoryArticlesTagsRelations = {
  relations: [
    common.articles,
    common.tags
  ]
}

const categoryTagsRelations = {
  relations: [
    common.unionTags
  ]
}


/**
 * get all categories, without relations
 */
export async function getAllCategories(req: Request, res: Response) {
  const ans = await categoryRepo().find(categoryArticlesTagsRelations)

  res.send(ans)
}

/**
 *
 */
export async function getCategoriesByNames(req: Request, res: Response) {

  if (common.expressErrorsBreak(req, res)) return

  const ans = await categoryRepo().find({
    ...categoryArticlesTagsRelations,
    ...common.whereNamesIn(req.query.names as string)
  })

  res.send(ans)
}

/**
 * save a category
 */
export async function saveCategory(req: Request, res: Response) {
  const rp = categoryRepo()
  const newCat = rp.create(req.body)
  await rp.save(newCat)

  res.send(newCat)
}

// todo: unsafe, since Article Tags should also unbinding
/**
 * delete a category
 */
export async function deleteCategory(req: Request, res: Response) {

  if (common.expressErrorsBreak(req, res)) return

  const name = req.query.name as string

  await categoryRepo()
    .createQueryBuilder()
    .delete()
    .where(`${ common.name } = :name`, { name })
    .execute()

  res.send(name)
}

// =====================================================================================================================

/**
 * get tags under a category
 */
export async function getTagsByCategoryName(req: Request, res: Response) {

  if (common.expressErrorsBreak(req, res)) return

  const ans = await categoryRepo()
    .findOne({
      ...categoryTagsRelations,
      ...common.whereNameEqual(req.query.name as string)
    })

  res.send(ans)
}

/**
 *
 */
export async function upsertCategoryTag(req: Request, res: Response) {

  if (common.expressErrorsBreak(req, res)) return

  const cr = categoryRepo()
  const prevCategory = await cr.findOne({
    ...categoryTagsRelations,
    ...common.whereNameEqual(req.body.name)
  })
  const preTags = prevCategory ? prevCategory.unionTags : []
  console.log(preTags)

  // todo: upsert preTags by `req.body.tag`

  // upsert if new tag not in category tags
  // const newCategory = cr.create({
  //   name: req.body.name,
  //   tags: updatedTags
  // })
  //
  // await cr.save(newCategory)

  res.send("test")
}

/**
 *
 */
// export async function removeCategoryTag(req: Request, res: Response) {
//
//   if (common.expressErrorsBreak(req, res)) return
//
//   const cat = await categoryRepo()
//   const tag = await tagRepo()
//
// }


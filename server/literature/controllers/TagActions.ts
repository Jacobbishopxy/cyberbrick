/**
 * Created by Jacob Xie on 8/15/2020.
 */

import { Request, Response } from "express"
import { getRepository } from "typeorm"
// import _ from "lodash"

import * as common from "../common"
import { Tag } from "../entities/Tag"


const tagRepo = () => getRepository(Tag)

const tagArticlesRelations = { relations: [common.articles] }
const tagCategoriesRelations = { relations: [common.articles, common.categories] }

/**
 * get all tags, with relations
 */
export async function getAllTags(req: Request, res: Response) {
  const ans = await tagRepo().find(tagCategoriesRelations)

  res.send(ans)
}

/**
 * get tags by names
 */
export async function getTagsByNames(req: Request, res: Response) {

  if (common.expressErrorsBreak(req, res)) return

  const tags = await tagRepo()
    .find({
      ...tagArticlesRelations,
      ...common.whereNamesIn(req.query.names as string)
    })

  res.send(tags)
}

// todo: unsafe, IMPORTANT
/**
 * save tag
 *
 * IMPORTANT:
 *
 * categories is always needed.
 */
export async function tagSaveAction(req: Request, res: Response) {
  const tr = tagRepo()
  const newTag = tr.create(req.body)
  await tr.save(newTag)

  res.send(newTag)
}

// todo: unsafe
/**
 * delete tag
 */
export async function tagDeleteAction(req: Request, res: Response) {

  if (common.expressErrorsBreak(req, res)) return

  const tag = await tagRepo().delete(req.query.name as string)

  res.send(tag)
}

// =====================================================================================================================

/**
 * get common categories by tag names
 */
// export async function getCommonCategoriesByTagNames(req: Request, res: Response) {
//
//   if (common.expressErrorsBreak(req, res)) return
//
//   const names = req.query.names as string
//   const tags = await repo()
//     .find({
//       ...tagCategoryRelations,
//       ...common.whereNamesIn(names)
//     })
//
//   const catNamesArr = tags.map(i => i.category)
//   const ans = _.reduce(catNamesArr, (acc, arr) => _.intersectionBy(acc, arr, common.name))
//
//   res.send(ans)
// }


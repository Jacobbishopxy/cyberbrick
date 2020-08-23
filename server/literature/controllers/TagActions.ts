/**
 * Created by Jacob Xie on 8/15/2020.
 */

import { Request, Response } from "express"
import { getRepository } from "typeorm"
import _ from "lodash"

import * as common from "../common"
import { Tag } from "../entities/Tag"


const repo = () => getRepository(Tag)

const tagCategoryRelations = { relations: [common.categories] }

/**
 * get all tags, with relations
 */
export async function getAllTags(req: Request, res: Response) {
  const ans = await repo().find(tagCategoryRelations)

  res.send(ans)
}

/**
 * get tags by names
 */
export async function getTagsByNames(req: Request, res: Response) {

  if (common.expressErrorsBreak(req, res)) return

  const tags = await repo()
    .find({
      ...tagCategoryRelations,
      ...common.whereNamesIn(req.query.names as string)
    })

  res.send(tags)
}

// todo: IMPORTANT
/**
 * save tag
 *
 * IMPORTANT:
 *
 * categories is always needed.
 */
export async function tagSaveAction(req: Request, res: Response) {
  const tagRepo = getRepository(Tag)
  const newTag = tagRepo.create(req.body)
  await tagRepo.save(newTag)

  res.send(newTag)
}

/**
 * delete tag
 */
export async function tagDeleteAction(req: Request, res: Response) {

  if (common.expressErrorsBreak(req, res)) return

  const tagRepo = getRepository(Tag)
  const tag = await tagRepo.delete(req.query.name as string)

  res.send(tag)
}

// =====================================================================================================================

/**
 * get common categories by tag names
 */
export async function getCommonCategoriesByTagNames(req: Request, res: Response) {

  if (common.expressErrorsBreak(req, res)) return

  const names = req.query.names as string
  const tags = await repo()
    .find({
      ...tagCategoryRelations,
      ...common.whereNamesIn(names)
    })

  const catNamesArr = tags.map(i => i.categories)
  const ans = _.reduce(catNamesArr, (acc, arr) => _.intersectionBy(acc, arr, common.name))

  res.send(ans)
}


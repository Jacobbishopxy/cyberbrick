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
 * get all tags, without relations
 */
export async function getAllTags(req: Request, res: Response) {
  const ans = await repo().find(tagCategoryRelations)

  res.send(ans)
}

export async function getTagsByNames(req: Request, res: Response) {

  if (common.expressErrorsBreak(req, res)) return

  const names = req.query.names as string
  const tags = await repo()
    .find({
      ...tagCategoryRelations,
      ...common.whereNamesIn(names)
    })

  res.send(tags)
}

export async function tagSaveAction(req: Request, res: Response) {
  const tagRepo = getRepository(Tag)
  const newTag = tagRepo.create(req.body)
  await tagRepo.save(newTag)

  res.send(newTag)
}

export async function tagDeleteAction(req: Request, res: Response) {
  const tagRepo = getRepository(Tag)
  const tag = await tagRepo.delete(req.query.name as string)

  res.send(tag)
}

// =====================================================================================================================

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

// export async function getArticleIdsByTagNames(req: Request, res: Response) {
//   const tagRepo = getRepository(Tag)
//   const names = req.query.names as string | undefined
//
//   if (names === undefined) {
//     res.send([])
//   } else {
//     const namesArr = names.split(",")
//     const tags = await tagRepo
//       .createQueryBuilder()
//       .leftJoinAndSelect(common.tagArticles, common.article)
//       .select([common.tagName, common.articleId])
//       .where(`${ common.tagName } IN (:...names)`, { names: namesArr })
//       .getMany()
//
//
//     const idsArr = tags.map(i => i.articles!.map(j => j.id))
//     const ans = _.reduce(idsArr, (acc, arr) => _.intersection(acc, arr))
//
//     res.send(ans)
//   }
// }

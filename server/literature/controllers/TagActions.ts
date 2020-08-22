/**
 * Created by Jacob Xie on 8/15/2020.
 */

import { Request, Response } from "express"
import { getRepository } from "typeorm"
import _ from "lodash"
import * as common from "../common"
import { Tag } from "../entities/Tag"


const repo = () => getRepository(Tag)

const tagArticleRelations = {
  relations: [
    common.articles,
    common.articlesAuthor,
    common.articlesCategory,
    common.articlesTags
  ]
}

const tagCategoryRelations = {
  relations: [
    common.category
  ]
}

/**
 * get all tags, without relations
 */
export async function getAllTags(req: Request, res: Response) {
  const ans = await repo().find(tagCategoryRelations)

  res.send(ans)
}

// todo: relation articles' pagination
export async function getArticlesByTagNames(req: Request, res: Response) {

  if (common.expressErrorsBreak(req, res)) return

  const names = req.query.names as string
  const ans = await repo()
    .find({
      ...tagArticleRelations,
      ...common.whereNamesIn(names)
    })


  res.send(ans)
}

export async function getCategoryByTagNames(req: Request, res: Response) {

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


export async function getTargetIdsByTagNames(req: Request, res: Response) {
  const tagRepo = getRepository(Tag)
  const names = req.query.names as string | undefined

  if (names === undefined) {
    res.send([])
  } else {
    const namesArr = names.split(",")
    const tags = await tagRepo
      .createQueryBuilder("tag")
      .leftJoinAndSelect("tag.targets", "target")
      .select(["tag.name", "target.id"])
      .where("tag.name IN (:...names)", { names: namesArr })
      .getMany()


    const idsArr = tags.map(i => i.articles!.map(j => j.id))
    const ans = _.reduce(idsArr, (acc, arr) => _.intersection(acc, arr))

    res.send(ans)
  }
}

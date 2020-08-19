/**
 * Created by Jacob Xie on 8/15/2020.
 */

import { Request, Response } from "express"
import { getRepository } from "typeorm"
import _ from "lodash"
import { Tag } from "../entities/Tag"


const tagRelations = { relations: ["targets"] }

export async function tagGetAllAction(req: Request, res: Response) {
  const tagRepo = getRepository(Tag)
  const { relationRequire } = req.query
  let tags: Tag[]
  if (relationRequire && relationRequire === "true")
    tags = await tagRepo.find(tagRelations)
  else
    tags = await tagRepo.find()

  res.send(tags)
}

export async function tagGetByName(req: Request, res: Response) {
  const tagRepo = getRepository(Tag)
  const tag = await tagRepo.findOne(req.query.name as string, tagRelations)

  if (!tag) {
    res.status(404)
    res.send()
    return
  }

  res.send(tag)
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


    const idsArr = tags.map(i => i.targets!.map(j => j.id))
    const ans = _.reduce(idsArr, (acc, arr) => _.intersection(acc, arr))

    res.send(ans)
  }
}

/**
 * Created by Jacob Xie on 8/15/2020.
 */

import { Request, Response } from "express"
import { getRepository } from "typeorm"
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

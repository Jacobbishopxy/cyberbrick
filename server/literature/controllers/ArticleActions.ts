/**
 * Created by Jacob Xie on 8/15/2020.
 */

import { Request, Response } from "express"
import { getRepository } from "typeorm"
import { Article } from "../entities/Article"
import { paginationSkip, paginationTake } from "../common"

const targetRelations = { relations: ["tags"] }

export async function targetGetAllAction(req: Request, res: Response) {
  const targetRepo = getRepository(Article)
  const targets = await targetRepo.find(targetRelations)

  res.send(targets)
}

export async function targetGetByIdAction(req: Request, res: Response) {
  const targetRepo = getRepository(Article)
  const target = await targetRepo.findOne(req.query.id as string, targetRelations)

  if (!target) {
    res.status(404)
    res.send()
    return
  }
  res.send(target)
}

export async function targetSaveAction(req: Request, res: Response) {
  const targetRepo = getRepository(Article)
  const newTarget = targetRepo.create(req.body)
  await targetRepo.save(newTarget)

  res.send(newTarget)
}

export async function targetDeleteAction(req: Request, res: Response) {
  const targetRepo = getRepository(Article)
  const target = await targetRepo.delete(req.query.id as string)

  res.send(target)
}

// =====================================================================================================================

export async function getTargetsByIds(req: Request, res: Response) {
  const targetRepo = getRepository(Article)
  const ids = req.query.ids as string | undefined
  const pagination = req.query.pagination as string | undefined

  if (ids === undefined) {
    res.send([])
  } else {
    const idsArr = ids.split(",")
    const targetsSql = targetRepo
      .createQueryBuilder()
      .leftJoinAndSelect("target.tags", "tag")
      .where("target.id IN (:...ids)", { ids: idsArr })
      .orderBy("target.date", "DESC")

    if (pagination === undefined) {
      res.send(await targetsSql.getMany())
    } else {
      const targets = targetsSql
        .skip(paginationSkip(pagination))
        .take(paginationTake(pagination))
        .getMany()
      res.send(await targets)
    }
  }
}


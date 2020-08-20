/**
 * Created by Jacob Xie on 8/15/2020.
 */

import { Request, Response } from "express"
import { getRepository, In } from "typeorm"

import * as common from "../common"
import { Article } from "../entities/Article"


const repo = () => getRepository(Article)
const articleRelations = { relations: [common.category, common.author, common.tags] }

export async function getAllArticles(req: Request, res: Response) {
  const targets = await repo().find(articleRelations)

  res.send(targets)
}

export async function getArticlesByIds(req: Request, res: Response) {
  const ids = req.query.ids as common.QueryStr
  const pagination = req.query.pagination as common.QueryStr
  if (ids === undefined) {
    res.status(400)
    res.send("ids is required, `?name=1,2,3`")
    return
  }

  let pg = {}
  if (pagination) pg = {
    skip: common.paginationSkip(pagination),
    take: common.paginationTake(pagination)
  }
  const wh = {
    where: {
      id: In(ids.split(","))
    }
  }
  const target = await repo()
    .find({
      ...articleRelations,
      ...wh,
      ...pg
    })

  res.send(target)
}

export async function saveArticle(req: Request, res: Response) {
  const r = repo()
  const newTarget = r.create(req.body)
  await r.save(newTarget)

  res.send(newTarget)
}

export async function deleteArticle(req: Request, res: Response) {
  const target = await repo().delete(req.query.id as string)

  res.send(target)
}


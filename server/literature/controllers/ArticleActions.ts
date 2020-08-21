/**
 * Created by Jacob Xie on 8/15/2020.
 */

import { Request, Response } from "express"
import { getRepository } from "typeorm"

import * as common from "../common"
import { Article } from "../entities/Article"


const repo = () => getRepository(Article)
const articleRelations = { relations: [common.category, common.author, common.tags] }

/**
 * get all articles, with relations
 */
export async function getAllArticles(req: Request, res: Response) {
  const targets = await repo().find(articleRelations)

  res.send(targets)
}

/**
 * get articles by ids, with relations
 */
export async function getArticlesByIds(req: Request, res: Response) {

  if (common.expressErrorsBreak(req, res)) return

  const ids = req.query.ids as string
  const pagination = req.query.pagination as common.QueryStr

  const target = await repo()
    .find({
      ...articleRelations,
      ...common.whereIdsIn(ids),
      ...common.paginationGet(pagination)
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


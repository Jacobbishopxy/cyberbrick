/**
 * Created by Jacob Xie on 8/15/2020.
 */

import { Request, Response } from "express"
import { getRepository } from "typeorm"

import * as common from "../common"
import { Article } from "../entities/Article"


const repo = () => getRepository(Article)
const articleRelations = { relations: [common.category, common.categoryTags, common.author] }

/**
 * get all articles, with relations
 */
export async function getAllArticles(req: Request, res: Response) {
  const ans = await repo().find(articleRelations)

  res.send(ans)
}

/**
 * get articles by ids, with relations
 */
export async function getArticlesByIds(req: Request, res: Response) {

  if (common.expressErrorsBreak(req, res)) return

  const ids = req.query.ids as string
  const pagination = req.query.pagination as common.QueryStr

  const ans = await repo()
    .find({
      ...articleRelations,
      ...common.whereIdsIn(ids),
      ...common.paginationGet(pagination)
    })

  res.send(ans)
}

// todo: express-validator required here for IMPORTANT reasons
/**
 * save article.
 *
 * IMPORTANT:
 *
 * Category is always needed, since no one wants unbounded A-C relationship.
 *
 */
export async function saveArticle(req: Request, res: Response) {
  const r = repo()
  const newArticle = r.create(req.body)
  await r.save(newArticle)

  res.send(newArticle)
}

/**
 * delete article by id
 */
export async function deleteArticle(req: Request, res: Response) {

  if (common.expressErrorsBreak(req, res)) return

  const ans = await repo().delete(req.query.id as string)

  res.send(ans)
}


/**
 * Created by Jacob Xie on 8/15/2020.
 */

import { Request, Response } from "express"
import { getRepository } from "typeorm"
import _ from "lodash"
import moment from "moment"

import * as common from "../common"
import { Article } from "../entities/Article"
import { Category } from "../entities/Category"


const articleRepo = () => getRepository(Article)
const categoryRepo = () => getRepository(Category)

const articleRelations = {
  relations: [
    common.category,
    common.tags,
    common.author
  ]
}
const categoryTagsRelations = {
  relations: [
    common.tags
  ]
}


/**
 * get all articles, with relations
 */
export async function getAllArticles(req: Request, res: Response) {
  const ans = await articleRepo().find(articleRelations)

  res.send(ans)
}

/**
 * get articles by ids, with relations
 */
export async function getArticlesByIds(req: Request, res: Response) {

  if (common.expressErrorsBreak(req, res)) return

  const ids = req.query.ids as string
  const pagination = req.query.pagination as common.QueryStr

  const ans = await articleRepo()
    .find({
      ...articleRelations,
      ...common.whereIdsIn(ids),
      ...common.paginationGet(pagination)
    })

  res.send(ans)
}

// todo: express-validator required here for IMPORTANT reasons
/**
 * save article. If id provided and article already exists, update article.
 *
 * IMPORTANT:
 *
 * Category is always needed, since no one wants unbounded A-C relationship.
 */
export async function saveArticle(req: Request, res: Response) {
  const ar = articleRepo()

  let reqBodyArticle = {}
  if (req.body.id)
    reqBodyArticle = { id: req.body.id }
  if (req.body.tags)
    reqBodyArticle = { ...reqBodyArticle, tags: req.body.tags }
  if (req.body.author)
    reqBodyArticle = { ...reqBodyArticle, author: req.body.author }
  if (req.body.date)
    reqBodyArticle = { ...reqBodyArticle, date: moment(req.body.date).utc(true) }
  else
    reqBodyArticle = { ...reqBodyArticle, date: moment().utc(true) }

  reqBodyArticle = {
    ...reqBodyArticle,
    category: req.body.category,
    title: req.body.title,
    text: req.body.text
  }

  const newArticle = ar.create(reqBodyArticle)
  await ar.save(newArticle)

  if (req.body.tags) {
    const cr = categoryRepo()

    const prevCategory = await cr.findOne({
      ...categoryTagsRelations,
      ...common.whereNameEqual(req.body.category.name)
    })
    const preTags = prevCategory ? prevCategory.unionTags : []

    // todo: description changed is not concerned
    // if new tags provided by article, update category's tags
    if (preTags.length !== req.body.tags.length) {
      const newCategory = cr.create({
        name: req.body.category.name,
        unionTags: _.unionWith(preTags, req.body.tags, _.isEqual)
      })

      await cr.save(newCategory)
    }
  }

  res.send(newArticle)
}

/**
 * delete article by id
 */
export async function deleteArticle(req: Request, res: Response) {

  if (common.expressErrorsBreak(req, res)) return

  const ans = await articleRepo().delete(req.query.id as string)

  res.send(ans)
}

// =====================================================================================================================

/**
 * get articles under a category, with full article relations
 */
export async function getArticlesByCategoryName(req: Request, res: Response) {

  if (common.expressErrorsBreak(req, res)) return

  const categoryName = req.query.categoryName as string
  const pagination = req.query.pagination as common.QueryStr

  const ans = await articleRepo()
    .createQueryBuilder(common.article)
    .leftJoinAndSelect(common.articleCategory, common.category)
    .where(`${ common.category }.${ common.name } = :categoryName`, { categoryName })
    .leftJoinAndSelect(common.articleTags, common.tag)
    .skip(common.paginationSkip(pagination))
    .take(common.paginationTake(pagination))
    .getMany()

  res.send(ans)
}

/**
 * get articles under a category with tags filtering
 */
export async function getArticlesByCategoryNameAndTagNames(req: Request, res: Response) {

  if (common.expressErrorsBreak(req, res)) return

  const categoryName = req.query.categoryName as string
  const tagNames = (req.query.tagNames as string).split(",")
  const pagination = req.query.pagination as common.QueryStr

  const ans = await articleRepo()
    .createQueryBuilder(common.article)
    .leftJoinAndSelect(common.articleCategory, common.category)
    .where(`${ common.category }.${ common.name } = :categoryName`, { categoryName })
    .leftJoinAndSelect(common.articleTags, common.tag)
    .where(`${ common.tag }.${ common.name } IN (:...tagNames)`, { tagNames })
    .skip(common.paginationSkip(pagination))
    .take(common.paginationTake(pagination))
    .getMany()

  res.send(ans)
}


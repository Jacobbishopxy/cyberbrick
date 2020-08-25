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
    common.unionTags
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
      ...common.whereStringIdsIn(ids),
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

  const reqId = req.body.id
  const reqTags = req.body.tags
  const reqAuthor = req.body.author
  const reqDate = req.body.date
  const reqCategory = req.body.category
  const reqTitle = req.body.title
  const reqText = req.body.text

  let reqBodyArticle = {}
  if (reqId)
    reqBodyArticle = { id: reqId }
  if (reqTags)
    reqBodyArticle = { ...reqBodyArticle, tags: reqTags }
  if (reqAuthor)
    reqBodyArticle = { ...reqBodyArticle, author: reqAuthor }
  if (reqDate)
    reqBodyArticle = { ...reqBodyArticle, date: moment(reqDate).utc(true) }
  else
    reqBodyArticle = { ...reqBodyArticle, date: moment().utc(true) }

  reqBodyArticle = {
    ...reqBodyArticle,
    category: reqCategory,
    title: reqTitle,
    text: reqText
  }

  const newArticle = ar.create(reqBodyArticle)
  await ar.save(newArticle)

  if (reqTags) {
    const cr = categoryRepo()

    const prevCategory = await cr.findOne({
      ...categoryTagsRelations,
      ...common.whereNameEqual(reqCategory.name)
    })
    const preTags = prevCategory ? prevCategory.unionTags : []

    // if new tags provided by article, update category's tags
    if (_.difference(reqTags, preTags).length === 0) {
      const newUnionTags = _.mergeWith(preTags, reqTags, (preTag, curTag) => {
        if (preTag.name === curTag.name)
          return curTag
        return preTag
      })

      const newCategory = cr.create({
        name: reqCategory.name,
        unionTags: newUnionTags
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
 * get articles under a category with tags filtering.
 * If tagNames not defined, query all articles under requested category.
 */
export async function getArticlesByCategoryNameAndTagNames(req: Request, res: Response) {

  if (common.expressErrorsBreak(req, res)) return

  const categoryName = req.query.categoryName as string
  const tagNames = req.query.tagNames as common.QueryStr
  const pagination = req.query.pagination as common.QueryStr


  let ans
  const que = articleRepo()
    .createQueryBuilder(common.article)
    .leftJoinAndSelect(common.articleCategory, common.category)

  if (tagNames) {
    const tags = tagNames.split(",")
    const articlesSimple = await que
      .leftJoinAndSelect(common.articleTags, common.tag)
      .select([common.tagName, common.categoryName, common.articleId])
      .where(`${ common.categoryName } = :categoryName`, { categoryName })
      .getMany()

    const ids = articlesSimple
      .filter(i => _.difference(tags, i.tags!.map(j => j.name)).length === 0)
      .map(i => i.id)

    ans = await articleRepo()
      .find({
        ...articleRelations,
        ...common.whereIdsIn(ids),
        ...common.paginationGet(pagination)
      })

  } else
    ans = await que
      .where(`${ common.categoryName } = :categoryName`, { categoryName })
      .skip(common.paginationSkip(pagination))
      .take(common.paginationTake(pagination))
      .getMany()

  res.send(ans)
}


/**
 * Created by Jacob Xie on 8/15/2020.
 */

import { Request, Response } from "express"
import { getConnection } from "typeorm"
import _ from "lodash"
import moment from "moment"

import * as common from "../common"
import * as utils from "../../utils"
import { Article } from "../entity/Article"
import { Category } from "../entity/Category"
import { Author } from "../entity/Author"


const articleRepo = () => getConnection(common.db).getRepository(Article)
const categoryRepo = () => getConnection(common.db).getRepository(Category)
const authorRepo = () => getConnection(common.db).getRepository(Author)

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
  const ans = await articleRepo().find({
    ...articleRelations,
    ...utils.orderByDate("DESC")
  })

  res.send(ans)
}

/**
 * get articles by ids, with relations
 */
export async function getArticlesByIds(req: Request, res: Response) {

  if (utils.expressErrorsBreak(req, res)) return

  const ids = (req.query.ids as string).split(",")
  const pagination = req.query.pagination as utils.QueryStr

  const ans = await articleRepo()
    .find({
      ...articleRelations,
      ...utils.whereIdsIn(ids),
      ...utils.paginationGet(pagination),
      ...utils.orderByDate("DESC")
    })

  res.send(ans)
}

/**
 * save article. If id provided and article already exists, update article.
 *
 * IMPORTANT:
 *
 * Category is always needed, since no one wants unbounded A-C relationship.
 */
export async function saveArticle(req: Request, res: Response) {

  if (utils.expressErrorsBreak(req, res)) return

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
  if (reqDate) {
    const date = moment(reqDate, "YYYYMMDDHHmmss").utc(true)

    if (date.isValid())
      reqBodyArticle = { ...reqBodyArticle, date }
    else {
      res.status(422).send(`invalid date input: ${ reqDate }`)
      return
    }
  } else
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
      ...utils.whereNameEqual(reqCategory.name)
    })
    const preTags = prevCategory ? prevCategory.unionTags : []

    // if new tags provided by article, update category's tags
    if (_.difference(reqTags, preTags).length !== 0) {
      const rawUnionTags = _.unionWith(preTags, reqTags, (preTag, curTag) =>
        preTag.name === curTag.name
      )
      const newUnionTags = _.mergeWith(rawUnionTags, reqTags, (preTag, curTag) => {
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

  if (utils.expressErrorsBreak(req, res)) return

  const ans = await articleRepo().delete(req.query.id as string)

  res.send(ans)
}


// =====================================================================================================================
/**
 * get articles under a category with tags filtering.
 * If tagNames not defined, query all articles under requested category.
 */
export async function getArticlesByCategoryNameAndTagNames(req: Request, res: Response) {

  if (utils.expressErrorsBreak(req, res)) return

  const categoryName = req.query.categoryName as string
  const tagNames = req.query.tagNames as utils.QueryStr
  const pagination = req.query.pagination as utils.QueryStr


  let ans
  const que = articleRepo()
    .createQueryBuilder(common.article)
    .leftJoinAndSelect(common.articleCategory, common.category)
    .leftJoinAndSelect(common.articleTags, common.tag)

  if (tagNames) {
    const tags = tagNames.split(",")
    const articlesSimple = await que
      .select([common.tagName, common.categoryName, common.articleId])
      .where(`${ common.categoryName } = :categoryName`, { categoryName })
      .getMany()

    const ids = articlesSimple
      .filter(i => _.difference(tags, i.tags!.map(j => j.name)).length === 0)
      .map(i => i.id)

    ans = await articleRepo()
      .find({
        ...articleRelations,
        ...utils.whereIdsIn(ids),
        ...utils.paginationGet(pagination),
        ...utils.orderByDate("DESC")
      })

  } else
    ans = await que
      .where(`${ common.categoryName } = :categoryName`, { categoryName })
      .orderBy({ date: "DESC" })
      .skip(utils.paginationSkip(pagination))
      .take(utils.paginationTake(pagination))
      .getMany()

  res.send(ans)
}

export async function getArticlesByAuthorName(req: Request, res: Response) {

  if (utils.expressErrorsBreak(req, res)) return

  const name = req.query.name as string
  const pagination = req.query.pagination as utils.QueryStr

  const articleIds = await authorRepo()
    .createQueryBuilder(common.author)
    .leftJoinAndSelect(common.authorArticles, common.article)
    .select([common.authorName, common.articleId])
    .where(`${ common.authorName } = :name`, { name })
    .getOne()

  if (articleIds) {
    const ids = articleIds.articles.map(i => i.id)

    const ans = await articleRepo()
      .find({
        ...articleRelations,
        ...utils.whereIdsIn(ids),
        ...utils.paginationGet(pagination),
        ...utils.orderByDate("DESC")
      })
    res.send(ans)
  } else {
    res.status(400).send(`Author ${ name } not found!`)
  }

}

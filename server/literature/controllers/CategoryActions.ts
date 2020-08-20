/**
 * Created by Jacob Xie on 8/19/2020.
 */

import { Request, Response } from "express"
import {
  getRepository,
  Equal
} from "typeorm"
import _ from "lodash"
import * as common from "../common"
import { Category } from "../entities/Category"


const repo = () => getRepository(Category)
const categoryRelations = { relations: [common.articles, common.articlesAuthor, common.articlesTags] }

export async function getAllCategories(req: Request, res: Response) {
  const categories = await repo().find()

  res.send(categories)
}

export async function getArticlesByCategoryName(req: Request, res: Response) {
  const name = req.query.name as common.QueryStr
  if (name === undefined) {
    res.status(400)
    res.send("name is required, `?name=Nx`")
    return
  }

  const wh = {
    where: {
      name: Equal(name)
    }
  }
  const cat = await repo()
    .findOne({
      ...categoryRelations,
      ...wh
    })

  res.send(cat)
}

export async function getArticleIdsByCategoryName(req: Request, res: Response) {
  const name = req.query.name as common.QueryStr
  if (name === undefined) {
    res.status(400)
    res.send("name is required, `?name=Nx`")
    return
  }

  const cat = await repo()
    .createQueryBuilder()
    .leftJoinAndSelect(common.categoryArticles, common.article)
    .select([common.categoryName, common.articleId])
    .where(`${ common.categoryName } = :name`, { name })
    .getOne()

  const idsArr = cat!.articles.map(i => i.id)

  res.send(idsArr)
}

export async function getArticleTagsByCategoryName(req: Request, res: Response) {
  const name = req.query.name as common.QueryStr
  if (name === undefined) {
    res.status(400)
    res.send("name is required, `?name=Nx`")
    return
  }

  const cat = await repo()
    .createQueryBuilder()
    .leftJoinAndSelect(common.categoryArticles, common.article)
    .leftJoinAndSelect(common.articleTags, common.tag)
    .select([common.categoryName, common.tagName])
    .where(`${ common.categoryName } = :name`, { name })
    .getOne()

  const tagsNamesArr = cat!.articles.map(i => i.tags!.map(j => j.name))
  const ans = _.reduce(tagsNamesArr, (acc, arr) => _.union(acc, arr))

  res.send(ans)
}

// export async function getArticlesByCategoryName(req: Request, res: Response) {
//   const name = req.query.name as common.QueryStr
//   if (name === undefined) {
//     res.status(400)
//     res.send("name is required, `?name=Nx`")
//     return
//   }
//
//   const cat = await repo()
//     .createQueryBuilder(common.category)
//     .leftJoinAndSelect(common.categoryArticles, common.article)
//     .leftJoinAndSelect(common.articleTags, common.tags)
//     .leftJoinAndSelect(common.articleAuthor, common.author)
//     .where(`${ common.categoryName } = :name`, { name })
//     .getMany()
//
//   res.send(cat)
// }

export async function saveCategory(req: Request, res: Response) {
  const rp = repo()
  const newCat = rp.create(req.body)
  await rp.save(newCat)

  res.send(newCat)
}

export async function deleteCategory(req: Request, res: Response) {
  const name = req.query.name as common.QueryStr
  if (name === undefined) {
    res.status(400)
    res.send("name is required")
    return
  }

  await repo()
    .createQueryBuilder()
    .delete()
    .where(`${ common.name } = :name`, { name })
    .execute()

  res.send(name)
}

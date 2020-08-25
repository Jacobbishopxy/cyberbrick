/**
 * Created by Jacob Xie on 8/19/2020.
 */

import { Request, Response } from "express"
import { getRepository } from "typeorm"
import _ from "lodash"

import * as common from "../common"
import { Category } from "../entities/Category"
import { Tag } from "../entities/Tag"


const categoryRepo = () => getRepository(Category)
const tagRepo = () => getRepository(Tag)

const categoryTagsRelations = { relations: [common.unionTags] }

/**
 * get all categories, without relations
 */
export async function getAllCategories(req: Request, res: Response) {
  const ans = await categoryRepo().find(categoryTagsRelations)

  res.send(ans)
}

/**
 *
 */
export async function getCategoriesByNames(req: Request, res: Response) {

  if (common.expressErrorsBreak(req, res)) return

  const ans = await categoryRepo().find({
    ...categoryTagsRelations,
    ...common.whereNamesIn(req.query.names as string)
  })

  res.send(ans)
}

// todo: unsafe, articles & tags should not occur in `req.body`
/**
 * save a category
 */
export async function saveCategory(req: Request, res: Response) {
  const cr = categoryRepo()
  const newCat = cr.create(req.body)
  await cr.save(newCat)

  res.send(newCat)
}

// todo: unsafe, since Article Tags should also unbinding
/**
 * delete a category
 */
export async function deleteCategory(req: Request, res: Response) {

  if (common.expressErrorsBreak(req, res)) return

  const name = req.query.name as string

  await categoryRepo()
    .createQueryBuilder()
    .delete()
    .where(`${ common.name } = :name`, { name })
    .execute()

  res.send(name)
}

// =====================================================================================================================

/**
 * get tags under a category
 */
export async function getTagsByCategoryName(req: Request, res: Response) {

  if (common.expressErrorsBreak(req, res)) return

  const ans = await categoryRepo()
    .findOne({
      ...categoryTagsRelations,
      ...common.whereNameEqual(req.query.name as string)
    })

  res.send(ans)
}

/**
 * insert new tag to a existing category, updating tag if already exists
 */
export async function upsertCategoryTag(req: Request, res: Response) {

  if (common.expressErrorsBreak(req, res)) return

  const cr = categoryRepo()
  const catName = req.body.name
  const prevCat = await cr.findOne({
    ...categoryTagsRelations,
    ...common.whereNameEqual(catName)
  })

  if (prevCat) {
    const preTags = prevCat.unionTags

    const newTag = req.body.tag
    let newTags

    const targetTag = _.find(preTags, i => i.name === newTag.name)

    if (targetTag) {
      const rawTargetTag = {
        name: targetTag.name,
        description: targetTag.description
      }

      if (_.isEqual(newTag, rawTargetTag)) {
        res.status(304).send(`Tag ${ newTag.name } not modified!`)
        return
      }

      newTags = preTags.map(i => i.name === newTag.name ? newTag : i)
    } else
      newTags = [...preTags, newTag]

    const newCat = cr.create({
      ...prevCat,
      unionTags: newTags
    })
    await cr.save(newCat)

    res.send(newCat)
    return
  }

  res.status(400).send(`Category ${ catName } not found!`)
}

/**
 * remove a tag from a existing category
 */
export async function removeCategoryTag(req: Request, res: Response) {

  if (common.expressErrorsBreak(req, res)) return

  const cr = categoryRepo()
  const catName = req.query.categoryName as string
  const prevCat = await cr.findOne({
    ...categoryTagsRelations,
    ...common.whereNameEqual(catName)
  })

  if (prevCat) {
    const tagName = req.query.tagName as string
    const newTags = prevCat.unionTags.filter(i => i.name !== tagName)

    if (newTags.length === prevCat.unionTags.length) {
      res.status(400).send(`Tag ${ tagName } not found!`)
      return
    }

    const newCat = cr.create({
      ...prevCat,
      unionTags: newTags
    })
    await cr.save(newCat)

    const tr = tagRepo()
    tr.delete(tagName)

    res.send(`Tag ${ tagName } deleted from Category ${ catName }`)
    return
  }

  res.status(400).send(`Category ${ catName } not found!`)
}


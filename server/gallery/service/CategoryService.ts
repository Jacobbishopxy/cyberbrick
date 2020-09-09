/**
 * Created by Jacob Xie on 9/9/2020.
 */

import { getConnection } from "typeorm"
import _ from "lodash"

import * as common from "../common"
import * as utils from "../../utils"
import { Category } from "../entity/Category"


const categoryRepo = () => getConnection(common.db).getRepository(Category)

const categoryFullRelations = {
  relations: [
    common.dashboard,
    common.unionMarks,
    common.unionTags,
    common.contents
  ]
}

const categoryMarkTagRelations = {
  relations: [
    common.unionMarks,
    common.unionTags
  ]
}

/**
 * get all categories, with full relations, test only
 */
export async function getAllCategories() {
  return categoryRepo().find(categoryFullRelations)
}

/**
 * get category by name, with full relations, test only
 */
export async function getCategoryByName(name: string) {
  return categoryRepo().find({
    ...categoryFullRelations,
    ...utils.whereNameEqual(name)
  })
}

/**
 * save category, test only
 */
export async function saveCategory(category: Category) {
  const cr = categoryRepo()
  const newCat = cr.create(category)
  await cr.save(newCat)

  return newCat
}

/**
 * delete category
 */
export async function deleteCategory(name: string) {
  return categoryRepo().delete(name)
}

// =====================================================================================================================


export async function getMarkAndTagFromCategory(name: string) {
  return categoryRepo().find({
    ...categoryMarkTagRelations,
    ...utils.whereNameEqual(name)
  })
}

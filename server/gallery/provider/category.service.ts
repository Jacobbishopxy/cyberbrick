/**
 * Created by Jacob Xie on 9/9/2020.
 */

import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { getConnection, Repository } from "typeorm"

import _ from "lodash"
import * as common from "../common"
import * as utils from "../../utils"
import { Category } from "../entity/category.entity"
import { Mark } from "../entity/mark.entity"
import { Tag } from "../entity/tag.entity"


const categoryRepo = () => getConnection(common.db).getRepository(Category)

const categoryFullRelations = {
  relations: [
    common.dashboard,
    common.marks,
    common.tags,
    common.contents
  ]
}

const categoryDashboardMarkTagRelations = {
  relations: [
    common.dashboard,
    common.marks,
    common.tags
  ]
}

const categoryMarkTagRelations = {
  relations: [
    common.marks,
    common.tags
  ]
}

const categoryMarkRelations = {
  relations: [common.marks]
}

const categoryTagRelations = {
  relations: [common.tags]
}

const categoryContentRelations = {
  relations: [common.contents]
}

type CategorySingleRelations =
  typeof categoryMarkRelations |
  typeof categoryTagRelations |
  typeof categoryContentRelations

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
  return categoryRepo().findOne({
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

  return utils.HTMLStatus.SUCCESS_MODIFY
}

/**
 * delete category
 */
export async function deleteCategory(name: string) {
  await categoryRepo().delete(name)
  return utils.HTMLStatus.SUCCESS_DELETE
}

// =====================================================================================================================


export async function getAllCategoriesName() {
  return categoryRepo().find({ select: [common.name] })
}

export async function getAllCategoriesWithoutContents() {
  return categoryRepo().find(categoryDashboardMarkTagRelations)
}

export async function getCategoryMarkAndTagByName(name: string) {
  return categoryRepo().findOne({
    ...categoryMarkTagRelations,
    ...utils.whereNameEqual(name)
  })
}

export async function getCategoryContentByName(name: string) {
  return categoryRepo().findOne({
    ...categoryContentRelations,
    ...utils.whereNameEqual(name)
  })
}

const findPrevCat = async (categoryName: string, relations: CategorySingleRelations) => {
  return categoryRepo().findOne({
    ...relations,
    ...utils.whereNameEqual(categoryName)
  })
}

export async function saveCategoryMark(categoryName: string, mark: Mark) {
  const cr = categoryRepo()
  const prevCat = await findPrevCat(categoryName, categoryMarkRelations)

  if (prevCat) {
    const preMarks = prevCat.marks
    const targetMark = _.find(preMarks, i => i.name === mark.name)

    let newMarks

    if (targetMark) {
      const rawTargetMark = {
        name: targetMark.name,
        description: targetMark.description
      }
      const rawMark = {
        name: mark.name,
        description: mark.description
      }

      if (_.isEqual(rawMark, rawTargetMark)) {
        return utils.HTMLStatus.NOT_MODIFY
      }

      newMarks = preMarks.map(i => i.name === mark.name ? { ...mark, id: i.id } : i)
    } else
      newMarks = [...preMarks, mark]

    const newCat = cr.create({
      ...prevCat,
      marks: newMarks
    })
    await cr.save(newCat)

    return utils.HTMLStatus.SUCCESS_MODIFY
  }

  return utils.HTMLStatus.FAIL_REQUEST
}

export async function saveCategoryTag(categoryName: string, tag: Tag) {

  const cr = categoryRepo()
  const prevCat = await findPrevCat(categoryName, categoryTagRelations)

  if (prevCat) {
    const preTags = prevCat.tags
    const targetTag = _.find(preTags, i => i.name === tag.name)

    let newTags

    if (targetTag) {
      const rawTargetTag = {
        name: targetTag.name,
        description: targetTag.description
      }
      const rawTag = {
        name: tag.name,
        description: tag.description
      }

      if (_.isEqual(rawTag, rawTargetTag)) {
        return utils.HTMLStatus.NOT_MODIFY
      }

      newTags = preTags.map(i => i.name === tag.name ? { ...tag, id: i.id } : i)
    } else
      newTags = [...preTags, tag]

    const newCat = cr.create({
      ...prevCat,
      tags: newTags
    })
    await cr.save(newCat)

    return utils.HTMLStatus.SUCCESS_MODIFY
  }

  return utils.HTMLStatus.FAIL_REQUEST
}

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private repo: Repository<Category>) {}

  getAllCategories() {
    return this.repo.find(categoryFullRelations)
  }

  getCategoryByName(name: string) {
    return this.repo.findOne({
      ...categoryFullRelations,
      ...utils.whereNameEqual(name)
    })
  }

  saveCategory(category: Category) {
    const newCat = this.repo.create(category)

    return this.repo.save(newCat)
  }

  deleteCategory(name: string) {
    return this.repo.delete(name)
  }

  // ===================================================================================================================

  getAllCategoriesName() {
    return this.repo.find({ select: [common.name] })
  }

  getAllCategoriesWithoutContents() {
    return this.repo.find(categoryDashboardMarkTagRelations)
  }

  getCategoryMarkAndTagByName(name: string) {
    return this.repo.findOne({
      ...categoryMarkTagRelations,
      ...utils.whereNameEqual(name)
    })
  }

  getCategoryContentByName(name: string) {
    return this.repo.findOne({
      ...categoryContentRelations,
      ...utils.whereNameEqual(name)
    })
  }

  private async findPrevCat(categoryName: string, relations: CategorySingleRelations) {
    return this.repo.findOne({
      ...relations,
      ...utils.whereNameEqual(categoryName)
    })
  }

  async saveCategoryMark(categoryName: string, mark: Mark) {
    const prevCat = await this.findPrevCat(categoryName, categoryMarkRelations)

    if (prevCat) {
      const preMarks = prevCat.marks
      const targetMark = _.find(preMarks, i => i.name === mark.name)

      let newMarks

      if (targetMark) {
        const rawTargetMark = {
          name: targetMark.name,
          description: targetMark.description
        }
        const rawMark = {
          name: mark.name,
          description: mark.description
        }

        if (_.isEqual(rawMark, rawTargetMark)) {
          return true
        }

        newMarks = preMarks.map(i => i.name === mark.name ? { ...mark, id: i.id } : i)
      } else
        newMarks = [...preMarks, mark]

      const newCat = this.repo.create({
        ...prevCat,
        marks: newMarks
      })
      await this.repo.save(newCat)

      return true
    }

    return false
  }

  async saveCategoryTag(categoryName: string, tag: Tag) {
    const prevCat = await this.findPrevCat(categoryName, categoryTagRelations)

    if (prevCat) {
      const preTags = prevCat.tags
      const targetTag = _.find(preTags, i => i.name === tag.name)

      let newTags

      if (targetTag) {
        const rawTargetTag = {
          name: targetTag.name,
          description: targetTag.description
        }
        const rawTag = {
          name: tag.name,
          description: tag.description
        }

        if (_.isEqual(rawTag, rawTargetTag)) {
          return true
        }

        newTags = preTags.map(i => i.name === tag.name ? { ...tag, id: i.id } : i)
      } else
        newTags = [...preTags, tag]

      const newCat = this.repo.create({
        ...prevCat,
        tags: newTags
      })
      await this.repo.save(newCat)

      return true
    }

    return false
  }
}


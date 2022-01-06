/**
 * Created by Jacob Xie on 9/9/2020.
 */

import {Injectable} from "@nestjs/common"
import {InjectRepository} from "@nestjs/typeorm"
import {Repository} from "typeorm"

import _ from "lodash"
import * as common from "../common"
import * as utils from "../../utils"
import {Category, Mark, Tag} from "../entity"


const categoryFullRelations = {
  relations: [
    common.dashboards,
    common.marks,
    common.tags,
    common.contents
  ]
}

const categoryDashboardMarkTagRelations = {
  relations: [
    common.dashboards,
    common.marks,
    common.tags
  ]
}

const categoriesDashboardsTemplatesRelations = {
  relations: [
    common.dashboards,
    common.dashboardsTemplates
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

const categoryDashboardRelations = {
  relations: [common.dashboards]
}

type CategorySingleRelations =
  typeof categoryMarkRelations |
  typeof categoryTagRelations |
  typeof categoryContentRelations


@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category, common.db) private repo: Repository<Category>) {}

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

  getAllCategoriesByType(type: string) {
    return this.repo.find({
      ...categoryFullRelations,
      ...utils.whereTypeEqual(type)
    })
  }

  getAllCategoriesNameWithType() {
    return this.repo.find({select: [common.name, common.type]})
  }

  getAllCategoriesWithoutContents() {
    return this.repo.find(categoryDashboardMarkTagRelations)
  }

  getAllCategoriesDashboardsTemplates() {
    return this.repo.find(categoriesDashboardsTemplatesRelations)
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

  getCategoryDashboardByName(name: string) {
    return this.repo.findOne({
      ...categoryDashboardRelations,
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

        newMarks = preMarks.map(i => i.name === mark.name ? {...mark, id: i.id} : i)
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

        newTags = preTags.map(i => i.name === tag.name ? {...tag, id: i.id} : i)
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


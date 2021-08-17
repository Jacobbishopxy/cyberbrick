/**
 * Created by Jacob Xie on 9/15/2020.
 */

import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import _ from "lodash"

import * as common from "../common"
import * as utils from "../../utils"
import { Tag, Category } from "../entity"


const categoryTagRelations = {
  relations: [common.tags]
}

const tagFullRelations = {
  relations: [
    common.category,
    common.contents
  ]
}

const tagCategoryRelations = {
  relations: [common.category]
}

@Injectable()
export class TagService {
  constructor(@InjectRepository(Tag, common.db) private repoTag: Repository<Tag>,
    @InjectRepository(Category, common.db) private repoCategory: Repository<Category>) { }

  getAllTags() {
    return this.repoTag.find(tagFullRelations)
  }

  getTagsByName(name: string) {
    return this.repoTag.find({
      ...tagFullRelations,
      ...utils.whereNameEqual(name)
    })
  }

  saveTag(tag: Tag) {
    const newTag = this.repoTag.create(tag)
    return this.repoTag.save(newTag)
  }

  deleteTag(id: string) {
    return this.repoTag.delete(id)
  }

  // ===================================================================================================================

  async getCategoriesByTagName(name: string) {
    const raw = await this.repoTag.find({
      ...tagCategoryRelations,
      ...utils.whereNameEqual(name),
      select: [common.id]
    })

    if (raw) return raw.map(i => i.category)
    return []
  }

  async modifyTag(tag: Tag) {
    if (tag.id) {
      const tg = await this.repoTag.findOne({ ...utils.whereIdEqual(tag.id) })

      if (tg) {
        const newTag = this.repoTag.create({
          ...tg,
          ...tag
        })
        await this.repoTag.save(newTag)
        return true
      }
    }
    return false
  }

  deleteTagInCategory(categoryName: string, tagName: string) {
    return this.repoTag
      .createQueryBuilder(common.tag)
      .leftJoinAndSelect(common.tagCategory, common.category)
      .select([common.tagName, common.categoryName])
      .where(`${common.categoryName} = :categoryName AND ${common.tagName} = :tagName`, {
        categoryName, tagName
      })
      .delete()
      .execute()
  }

  saveTags(tags: Tag[]) {
    const newTags = tags.map(t => this.repoTag.create(t))
    return this.repoTag.save(newTags)
  }

  deleteTags(tagIds: string[]) {
    return this.repoTag.delete(tagIds)
  }

  async updateTagsInCategory(categoryName: string, tags: Tag[]) {
    const cat = await this.repoCategory.findOne({
      ...categoryTagRelations,
      ...utils.whereNameEqual(categoryName)
    })

    if (cat) {
      const tagsRemove = _.differenceWith(
        cat.tags, tags, (prev, curr) => prev.id === curr.id
      )

      if (tagsRemove.length > 0)
        await this.deleteTags(tagsRemove.map(t => t.id))
      //relate tags with category, otherwise Error: "null value in column "categoryName" violates not-null constraint" 
      tags = tags.map(tag => { return { ...tag, category: cat } })
      await this.saveTags(tags)

      return true
    }

    return false
  }
}


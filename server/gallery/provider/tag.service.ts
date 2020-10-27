/**
 * Created by Jacob Xie on 9/15/2020.
 */

import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import * as common from "../common"
import * as utils from "../../utils"
import { Tag } from "../entity"


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
  constructor(@InjectRepository(Tag, common.db) private repo: Repository<Tag>) {}

  getAllTags() {
    return this.repo.find(tagFullRelations)
  }

  getTagsByName(name: string) {
    return this.repo.find({
      ...tagFullRelations,
      ...utils.whereNameEqual(name)
    })
  }

  saveTag(tag: Tag) {
    const newTag = this.repo.create(tag)
    return this.repo.save(newTag)
  }

  deleteTag(id: string) {
    return this.repo.delete(id)
  }

  // ===================================================================================================================

  async getCategoriesByTagName(name: string) {
    const raw = await this.repo.find({
      ...tagCategoryRelations,
      ...utils.whereNameEqual(name),
      select: [common.id]
    })

    if (raw) return raw.map(i => i.category)
    return []
  }

  deleteTagInCategory(categoryName: string, tagName: string) {
    return this.repo
      .createQueryBuilder(common.tag)
      .leftJoinAndSelect(common.tagCategory, common.category)
      .select([common.tagName, common.categoryName])
      .where(`${ common.categoryName } = :categoryName AND ${ common.tagName } = :tagName`, { categoryName, tagName })
      .delete()
      .execute()
  }
}


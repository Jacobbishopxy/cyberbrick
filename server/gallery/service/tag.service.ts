/**
 * Created by Jacob Xie on 9/15/2020.
 */

import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { getConnection, Repository } from "typeorm"

import * as common from "../common"
import * as utils from "../../utils"
import { Tag } from "../entity/Tag"


const tagRepo = () => getConnection(common.db).getRepository(Tag)

const tagFullRelations = {
  relations: [
    common.category,
    common.contents
  ]
}

const tagCategoryRelations = {
  relations: [common.category]
}

export async function getAllTags() {
  return tagRepo().find(tagFullRelations)
}

export async function getTagsByName(name: string) {
  return tagRepo().find({
    ...tagFullRelations,
    ...utils.whereNameEqual(name)
  })
}

export async function saveTag(tag: Tag) {
  const tr = tagRepo()
  const newTag = tr.create(tag)
  await tr.save(newTag)

  return utils.HTMLStatus.SUCCESS_MODIFY
}

export async function deleteTag(id: string) {
  await tagRepo().delete(id)
  return utils.HTMLStatus.SUCCESS_DELETE
}

// =====================================================================================================================


export async function getCategoriesByTagName(name: string) {
  const raw = await tagRepo().find({
    ...tagCategoryRelations,
    ...utils.whereNameEqual(name),
    select: [common.id]
  })

  if (raw) return raw.map(i => i.category)
  return []
}

export async function deleteTagInCategory(categoryName: string, tagName: string) {
  const raw = await tagRepo()
    .createQueryBuilder(common.tag)
    .leftJoinAndSelect(common.tagCategory, common.category)
    .select([common.tagName, common.categoryName])
    .where(`${ common.categoryName } = :categoryName AND ${ common.tagName } = :tagName`, { categoryName, tagName })
    .delete()
    .execute()

  if (raw) return utils.HTMLStatus.SUCCESS_DELETE
  return utils.HTMLStatus.FAIL_OPERATION
}

@Injectable()
export class TagService {
  constructor(@InjectRepository(Tag) private repo: Repository<Tag>) {}

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


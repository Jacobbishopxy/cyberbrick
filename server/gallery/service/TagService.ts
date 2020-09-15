/**
 * Created by Jacob Xie on 9/15/2020.
 */


import { getConnection } from "typeorm"

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

const tagContentRelations = {
  relations: [common.contents]
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



/**
 * Created by Jacob Xie on 9/15/2020.
 */

import { getConnection } from "typeorm"

import * as common from "../common"
import * as utils from "../../utils"
import { Content } from "../entity/Content"

const contentRepo = () => getConnection(common.db).getRepository(Content)

const contentFullRelations = {
  relations: [
    common.element,
    common.mark,
    common.tags,
    common.author
  ]
}

export async function getAllContents() {
  return contentRepo().find(contentFullRelations)
}

export async function getContentById(id: string) {
  return  contentRepo().find({
    ...contentFullRelations,
    ...utils.whereIdEqual(id)
  })
}

export async function saveContent(content: Content) {
  const cr = contentRepo()
  const newContent = cr.create(content)
  await cr.save(newContent)

  return utils.HTMLStatus.SUCCESS_MODIFY
}

export async function deleteContent(id: string) {
  await contentRepo().delete(id)
  return utils.HTMLStatus.SUCCESS_DELETE
}

// =====================================================================================================================



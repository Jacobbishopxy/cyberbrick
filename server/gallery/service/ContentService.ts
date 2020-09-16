/**
 * Created by Jacob Xie on 9/15/2020.
 */

import { getConnection } from "typeorm"
import _ from "lodash"
import moment from "moment"

import * as common from "../common"
import * as utils from "../../utils"
import { Content } from "../entity/Content"

const contentRepo = () => getConnection(common.db).getRepository(Content)

const contentFullRelations = {
  relations: [
    common.element,
    common.category,
    common.mark,
    common.tags,
    common.author
  ]
}

export async function getAllContents() {
  return contentRepo().find(contentFullRelations)
}

export async function getContentById(id: string) {
  return contentRepo().find({
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


export async function getContentsInCategoryByMarkAndTags(categoryName: string,
                                                         markName?: string,
                                                         tagNames?: string[],
                                                         pagination?: [number, number]) {
  const cr = contentRepo()
  let que = cr
    .createQueryBuilder(common.content)
    .leftJoinAndSelect(common.contentElement, common.element)
    .leftJoinAndSelect(common.contentCategory, common.category)
    .leftJoinAndSelect(common.contentMark, common.mark)
    .leftJoinAndSelect(common.contentTags, common.tag)
    .leftJoinAndSelect(common.contentAuthor, common.author)
    .where(`${ common.categoryName } = :categoryName`, { categoryName })

  if (markName)
    que = que.andWhere(`${ common.markName } = :markName`, { markName })

  if (tagNames) {
    const contentSimple = await que
      .select([common.tagName, common.contentId])
      .getMany()

    const ids = contentSimple
      .filter(i => _.difference(tagNames, i.tags.map(j => j.name)).length === 0)
      .map(i => i.id)

    return cr.find({
      ...contentFullRelations,
      ...utils.whereIdsIn(ids),
      ...utils.paginationGet2(pagination),
      ...utils.orderByDate("DESC")
    })
  }

  if (pagination)
    que = que.skip(pagination[0]).take(pagination[1])

  const ans = await que
    .orderBy({ date: "DESC" })
    .getMany()

  if (ans) return ans
  return []
}

export async function saveContentInCategory(name: string, content: Content) {

  let ctn = {}
  if (content.id) ctn = { id: content.id }
  if (content.element) ctn = { ...ctn, element: content.element }
  if (content.mark) ctn = { ...ctn, mark: content.mark }
  if (content.tags) ctn = { ...ctn, tags: content.tags }
  if (content.author) ctn = { ...ctn, author: content.author }
  if (content.config) ctn = { ...ctn, config: content.config }
  ctn = {
    ...ctn,
    category: content.category,
    date: moment(content.date, common.dateFormat),
    title: content.title,
    data: content.data,
  }

  const cr = contentRepo()
  const newContent = cr.create(ctn)
  const ans = await cr.save(newContent)

  if (ans) return utils.HTMLStatus.SUCCESS_MODIFY
  return utils.HTMLStatus.FAIL_OPERATION
}


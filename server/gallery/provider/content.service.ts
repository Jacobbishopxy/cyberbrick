/**
 * Created by Jacob Xie on 9/15/2020.
 */

import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { getConnection, Repository } from "typeorm"
import _ from "lodash"
import moment from "moment"

import * as common from "../common"
import * as utils from "../../utils"
import { Content } from "../entity"

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


export async function getContentsInCategoryByElementTypeAndMarkAndTags(categoryName: string,
                                                                       elementType?: common.ElementType,
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

  if (elementType)
    que = que.andWhere(`${ common.elementType } = :elementType`, { elementType })

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

/**
 * IMPORTANT:
 *
 * when updating content, existing mark & tags should have id field
 */
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
    category: { name },
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

@Injectable()
export class ContentService {
  constructor(@InjectRepository(Content, common.db) private repo: Repository<Content>) {}

  getAllContents() {
    return this.repo.find(contentFullRelations)
  }

  getContentById(id: string) {
    return this.repo.find({
      ...contentFullRelations,
      ...utils.whereIdEqual(id)
    })
  }

  saveContent(content: Content) {
    const newContent = this.repo.create(content)
    return this.repo.save(newContent)
  }

  deleteContent(id: string) {
    return this.repo.delete(id)
  }

  // ===================================================================================================================

  async getContentsInCategoryByElementTypeAndMarkAndTags(categoryName: string,
                                                         elementType?: common.ElementType,
                                                         markName?: string,
                                                         tagNames?: string[],
                                                         pagination?: [number, number]) {
    let que = this.repo
      .createQueryBuilder(common.content)
      .leftJoinAndSelect(common.contentElement, common.element)
      .leftJoinAndSelect(common.contentCategory, common.category)
      .leftJoinAndSelect(common.contentMark, common.mark)
      .leftJoinAndSelect(common.contentTags, common.tag)
      .leftJoinAndSelect(common.contentAuthor, common.author)
      .where(`${ common.categoryName } = :categoryName`, { categoryName })

    if (elementType)
      que = que.andWhere(`${ common.elementType } = :elementType`, { elementType })

    if (markName)
      que = que.andWhere(`${ common.markName } = :markName`, { markName })

    if (tagNames) {
      const contentSimple = await que
        .select([common.tagName, common.contentId])
        .getMany()

      const ids = contentSimple
        .filter(i => _.difference(tagNames, i.tags.map(j => j.name)).length === 0)
        .map(i => i.id)

      return this.repo.find({
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

  saveContentInCategory(name: string, content: Content) {
    let ctn = {}
    if (content.id) ctn = { id: content.id }
    if (content.element) ctn = { ...ctn, element: content.element }
    if (content.mark) ctn = { ...ctn, mark: content.mark }
    if (content.tags) ctn = { ...ctn, tags: content.tags }
    if (content.author) ctn = { ...ctn, author: content.author }
    if (content.config) ctn = { ...ctn, config: content.config }
    ctn = {
      ...ctn,
      category: { name },
      date: moment(content.date, common.dateFormat),
      title: content.title,
      data: content.data,
    }

    const newContent = this.repo.create(ctn)
    return this.repo.save(newContent)
  }
}


/**
 * Created by Jacob Xie on 9/16/2020.
 */

import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { getConnection, Repository } from "typeorm"

import * as common from "../common"
import * as utils from "../../utils"
import { Element, Content } from "../entity"



const elementRepo = () => getConnection(common.db).getRepository(Element)

const templateAndContentRelations = {
  relations: [
    common.template,
    common.contents
  ]
}

export async function getAllElements() {
  return elementRepo().find(templateAndContentRelations)
}

export async function getElementsByIds(ids: string[]) {
  return elementRepo().find({
    ...templateAndContentRelations,
    ...utils.whereIdsIn(ids)
  })
}

export async function saveElement(element: Element) {
  const er = elementRepo()
  const newEle = er.create(element)
  await er.save(newEle)

  return utils.HTMLStatus.SUCCESS_MODIFY
}

export async function deleteElement(id: string) {
  await elementRepo().delete(id)

  return utils.HTMLStatus.SUCCESS_DELETE
}

// =====================================================================================================================

export async function getElementContentDates(id: string, markName?: string) {
  let que = elementRepo()
    .createQueryBuilder(common.element)
    .where(`${ common.elementId } = :id`, { id })
    .leftJoinAndSelect(common.elementContents, common.content)

  if (markName)
    que = que
      .leftJoinAndSelect(common.contentMark, common.mark)
      .andWhere(`${ common.markName } = :markName`, { markName })

  const ans = await que
    .select([common.elementId, common.contentDate])
    .getOne()

  if (ans) return ans
  return {}
}

async function getElementContentByDate(id: string, date: string, markName?: string) {
  const que = elementRepo()
    .createQueryBuilder(common.element)
    .select(common.elementId)
    .leftJoinAndSelect(common.elementContents, common.content)
    .where(`${ common.elementId } = :id AND ${ common.contentDate } = :date`, { id, date })

  const ans = markName ?
    await que
      .leftJoin(common.contentMark, common.mark)
      .andWhere(`${ common.markName } = :markName`, { markName })
      .getOne() :
    await que.getOne()

  if (ans) return ans
  return {}
}

async function getElementLatestContent(id: string, markName?: string) {
  const que = elementRepo()
    .createQueryBuilder(common.element)
    .select(common.elementId)
    .leftJoin(qb => {
        let raw = qb.from(Content, common.content)
        if (markName)
          raw = qb
            .leftJoin(common.contentMark, common.mark)
            .where(`${ common.markName } = :markName`, { markName })
        return raw
          .select(`MAX(${ common.date })`, common.date)
          .addSelect(`"elementId"`, "eid")
          .groupBy("eid")
      },
      "last_date",
      "last_date.eid = element.id"
    )
    .leftJoinAndSelect(
      common.elementContents,
      common.content,
      `${ common.contentDate } = last_date.date`
    )
    .where(`${ common.elementId } = :id`, { id })

  const ans = markName ?
    await que
      .leftJoin(common.contentMark, common.mark)
      .andWhere(`${ common.markName } = :markName`, { markName })
      .getOne() :
    await que.getOne()


  if (ans) return ans
  return {}
}

/**
 * if date is not provided, get latest content
 */
export async function getElementContent(id: string, date?: string, markName?: string) {
  if (date) return getElementContentByDate(id, date, markName)
  return getElementLatestContent(id, markName)
}


@Injectable()
export class ElementService {
  constructor(@InjectRepository(Element, common.db) private repo: Repository<Element>) {}

  getAllElements() {
    return this.repo.find(templateAndContentRelations)
  }

  getElementsByIds(ids: string[]) {
    return this.repo.find({
      ...templateAndContentRelations,
      ...utils.whereIdsIn(ids)
    })
  }

  saveElement(element: Element) {
    const newEle = this.repo.create(element)
    return this.repo.save(newEle)
  }

  deleteElement(id: string) {
    return this.repo.delete(id)
  }

  // ===================================================================================================================

  getElementContentDates(id: string, markName?: string) {
    let que = this.repo
      .createQueryBuilder(common.element)
      .where(`${ common.elementId } = :id`, { id })
      .leftJoinAndSelect(common.elementContents, common.content)

    if (markName)
      que = que
        .leftJoinAndSelect(common.contentMark, common.mark)
        .andWhere(`${ common.markName } = :markName`, { markName })

    return que
      .select([common.elementId, common.contentDate])
      .getOne()
  }

  private getElementContentByDate(id: string, date: string, markName?: string) {
    const que = this.repo
      .createQueryBuilder(common.element)
      .select(common.elementId)
      .leftJoinAndSelect(common.elementContents, common.content)
      .where(`${ common.elementId } = :id AND ${ common.contentDate } = :date`, { id, date })

    return markName ?
      que
        .leftJoin(common.contentMark, common.mark)
        .andWhere(`${ common.markName } = :markName`, { markName })
        .getOne() :
      que.getOne()
  }

  private getElementLatestContent(id: string, markName?: string) {
    const que = this.repo
      .createQueryBuilder(common.element)
      .select(common.elementId)
      .leftJoin(qb => {
          let raw = qb.from(Content, common.content)
          if (markName)
            raw = qb
              .leftJoin(common.contentMark, common.mark)
              .where(`${ common.markName } = :markName`, { markName })
          return raw
            .select(`MAX(${ common.date })`, common.date)
            .addSelect(`"elementId"`, "eid")
            .groupBy("eid")
        },
        "last_date",
        "last_date.eid = element.id"
      )
      .leftJoinAndSelect(
        common.elementContents,
        common.content,
        `${ common.contentDate } = last_date.date`
      )
      .where(`${ common.elementId } = :id`, { id })

    return markName ?
      que
        .leftJoin(common.contentMark, common.mark)
        .andWhere(`${ common.markName } = :markName`, { markName })
        .getOne() :
      que.getOne()
  }

  getElementContent(id: string, date?: string, markName?: string) {
    if (date) return this.getElementContentByDate(id, date, markName)
    return this.getElementLatestContent(id, markName)
  }
}


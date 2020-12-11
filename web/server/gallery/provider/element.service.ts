/**
 * Created by Jacob Xie on 9/16/2020.
 */

import {Injectable} from "@nestjs/common"
import {InjectRepository} from "@nestjs/typeorm"
import {Repository} from "typeorm"

import * as common from "../common"
import * as utils from "../../utils"
import {Element, Content} from "../entity"


const templateAndContentRelations = {
  relations: [
    common.template,
    common.contents
  ]
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
      .where(`${common.elementId} = :id`, {id})
      .leftJoinAndSelect(common.elementContents, common.content)

    if (markName)
      que = que
        .leftJoinAndSelect(common.contentMark, common.mark)
        .andWhere(`${common.markName} = :markName`, {markName})

    return que
      .select([common.elementId, common.contentDate])
      .getOne()
  }

  private getElementContentByDate(id: string, date: string, markName?: string) {
    const que = this.repo
      .createQueryBuilder(common.element)
      .select(common.elementId)
      .leftJoinAndSelect(common.elementContents, common.content)
      .where(`${common.elementId} = :id AND ${common.contentDate} = :date`, {id, date})

    return markName ?
      que
        .leftJoin(common.contentMark, common.mark)
        .andWhere(`${common.markName} = :markName`, {markName})
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
              .where(`${common.markName} = :markName`, {markName})
          return raw
            .select(`MAX(${common.date})`, common.date)
            .addSelect(`"elementId"`, "eid")
            .groupBy("eid")
        },
        "last_date",
        "last_date.eid = element.id"
      )
      .leftJoinAndSelect(
        common.elementContents,
        common.content,
        `${common.contentDate} = last_date.date`
      )
      .where(`${common.elementId} = :id`, {id})

    return markName ?
      que
        .leftJoin(common.contentMark, common.mark)
        .andWhere(`${common.markName} = :markName`, {markName})
        .getOne() :
      que.getOne()
  }

  getElementContent(id: string, date?: string, markName?: string) {
    if (date) return this.getElementContentByDate(id, date, markName)
    return this.getElementLatestContent(id, markName)
  }

  async modifyElement(id: string, element: Element) {
    const el = await this.repo.findOne({...utils.whereIdEqual(id)})

    if (el) {
      const newElement = this.repo.create({...el, ...element})
      await this.repo.save(newElement)
      return true
    }
    return false
  }
}


/**
 * Created by Jacob Xie on 9/16/2020.
 */

import {Injectable} from "@nestjs/common"
import {InjectRepository} from "@nestjs/typeorm"
import {Repository} from "typeorm"

import * as common from "../common"
import * as utils from "../../utils"
import {Element, Content} from "../entity"
import * as MongoService from "./contentMongo.service"

const templateAndContentRelations = {
  relations: [
    common.template,
    common.contents
  ]
}

@Injectable()
export class ElementService {
  constructor(@InjectRepository(Element, common.db) private repo: Repository<Element>,
    private readonly mongoService: MongoService.MongoService) {}

  getAllElements() {
    return this.repo.find(templateAndContentRelations)
  }

  getElementsByIds(ids: string[]) {
    return this.repo.find({
      ...templateAndContentRelations,
      ...utils.whereIdsIn(ids)
    })
  }

  getElementById(id: string) {
    return this.repo.find({
      ...templateAndContentRelations,
      ...utils.whereIdEqual(id)
    })
  }

  saveElement(element: Element) {
    const newEle = this.repo.create(element)
    return this.repo.save(newEle)
  }

  deleteElement(id: string) {
    return this.repo.softDelete(id)
    // this.repo.delete(id)
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
      .select([common.elementId, common.contentId, common.contentDate])
      .getOne()
  }

  private getElementContentByDate(id: string, date: string, markName?: string) {
    const que = this.repo
      .createQueryBuilder(common.element)
      .select(common.elementId)
      .addSelect(common.elementType)//also return element type
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
      .addSelect(common.elementType)//also return element type
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

  async getElementContent(id: string, date?: string, markName?: string) {
    if (date) return this.getElementContentByDate(id, date, markName)
    return this.getElementLatestContent(id, markName)
  }

  //fetch data from 3rd party database
  async getQueryDataByStorageType(content: Content) {
    switch (content.storageType) {
      case common.StorageType.MONGO:
        // console.log("query to mongo\n", content.data)
        return this.mongoService.getContentData(content.data.collection, content.data.id)
      default:
        return undefined
    }
  }

  /**
   * 1. fetch content from postgres by element id (and date if presented)
   * 2. check if we need to fetch query from 3rd party database by element type
   * 3. if yes, then fetch
   * @param id element id
   * @param date content date
   * @param markName depreciated
   * @returns content: Content
   */
  async getElementContentAndFetchQuery(id: string, date?: string, markName?: string) {
    let EleContent
    if (date) EleContent = await this.getElementContentByDate(id, date, markName)
    else EleContent = await this.getElementLatestContent(id, markName)
    //can't find
    if (!EleContent) return undefined

    let content = EleContent.contents[0] || undefined
    const elementType = EleContent.type
    // if (elementType === common.ElementType.XlsxTable) console.log(elementType, content)
    //if we should and could fetch query, fetch!
    return this.onReceiveContentToFetchQuery(elementType, content)
  }

  /** 1. determine whether the content is "pointer".
       * 2. If it is, fetch the actual data from 3rd party database by calling fetchQuery. 
       * 3. update the content to make sure we have the actual content stored in React state.
     */
  async onReceiveContentToFetchQuery(elementType: common.ElementType, content: Content) {
    let ct = content
    // console.log(content
    //   && common.shouldQueryAfterRecevingContent(elementType)
    //   && common.ContentValidationByType(elementType, content.data))
    if (
      content
      && common.shouldQueryAfterReceivingContent(elementType, content)
      && common.ContentValidationByType(elementType, content.data)
    ) {
      const res = await this.getQueryDataByStorageType(content)
      // console.log(content, res)
      //update content's data with newly fetched data
      ct = {...content, data: {...content.data, ...res}}
    }
    return ct
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

  /**
   * save bulk of elements
   * @param elements Element[]
   * @returns Element[], with ids (in create case)
   */
  async saveElements(elements: Element[]) {
    // const newElements = elements.map(e => this.repo.create(e))
    return this.repo.save(elements)
  }
}

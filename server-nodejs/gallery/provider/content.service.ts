/**
 * Created by Jacob Xie on 9/15/2020.
 */

import {HttpException, HttpStatus, Injectable} from "@nestjs/common"
import {InjectRepository} from "@nestjs/typeorm"
import {Repository} from "typeorm"
import _ from "lodash"
import moment from "moment"

import * as common from "../common"
import * as utils from "../../utils"
import {Content} from "../entity"
import * as MongoService from "./contentMongo.service"
import * as ElementService from "./element.service"

const contentFullRelations = {
  relations: [
    common.element,
    common.category,
    common.mark,
    common.tags,
    common.author
  ]
}

@Injectable()
export class ContentService {
  constructor(@InjectRepository(Content, common.db) private repo: Repository<Content>,
    private readonly mongoService: MongoService.MongoService,
    private readonly elementService: ElementService.ElementService
  ) {}

  getAllContents() {
    return this.repo.find(contentFullRelations)
  }

  async getContentById(id: string) {
    const ct = await this.repo.find({
      ...contentFullRelations,
      ...utils.whereIdEqual(id)
    })
    return ct && ct[0]
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
      .where(`${common.categoryName} = :categoryName`, {categoryName})

    if (elementType)
      que = que.andWhere(`${common.elementType} = :elementType`, {elementType})

    if (markName)
      que = que.andWhere(`${common.markName} = :markName`, {markName})

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
        ...utils.paginationGet(pagination),
        ...utils.orderByDate("DESC")
      })
    }

    if (pagination)
      que = que.skip(pagination[0]).take(pagination[1])

    const ans = await que
      .orderBy({date: "DESC"})
      .getMany()

    if (ans) return ans
    return []
  }


  /**
   * type will fetch data from 3rd party library (in this case mongodb)
   * @param contentId content's id in postgres
   * @returns the portion of content.data that stored in 3rd party library
   */
  async getNestedElementContent(contentId: string) {
    let content = await this.getContentById(contentId)
    const queryData = await this.elementService.getQueryDataByStorageType(content)
    content = {...content, data: {...content.data, ...queryData}}
    // console.log(content)
    return content
  }

  /**
   * deprecated! Nested module information no longer save in Content, instead it saves Element information
   *
   * save content to pg.
   * 1. If element type is nestedSimple, first save all its modules' content
   *    to 3rd party and/or to postgres. Then update the module to be a
   *    pointer to the actual content inside postgres. Finally, save the
   *    nested module content to postgres.
   * 2. Otherwise, directly save to 3rd party and/or to postgres
   * @param name category name
   * @param type element type
   * @param content element's content
   * @returns Promise<Content>
   */
  async saveNestedOrSimpleContent(name: string, type: string, content: Content) {
    switch (type) {
      case common.ElementType.NestedModule:
        /* content type:
        currIndex: string (used to indicate the tab when entering)
        tabItem: tabItem[]:
        for each item:
            id: i
            layout attribute: x y w h

            tab content attribute:
                tabContent: the content that will be displayed for a tab item
                tabType: the type of the content
                minDim: the minimal length between width and height. Used to calculate an item's font-size

            module: SimpleEmbededModule {
              name: string,
              timeSeries: boolean,
              elementType: ElementType,
              content?: Content (only leaves {id, date, tabId})
        }*/
        //first save each tabItem's module content separately.
        content?.data?.tabItems?.forEach(async (item: any) => {
          if (item?.module?.content) {
            try {
              const newCt = await this.saveContentToMongoOrPg(content.category.name, item.module.elementType, item.module.content)
              item.module.content = {id: newCt.id, tabId: newCt.tabId, date: newCt.date}
              // console.log("nested content with id:\n", item.module.content)
            } catch (err: any) {
              throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
            }
            finally {
              //and then save nestedModuleContent to PG
              this.saveContentToMongoOrPg(name, type, content)

            }
          }
        })
        break
      default:
        this.saveContentToMongoOrPg(name, type, content)
    }

  }

  /**
   * save to 3rd party db (only supports mongodb for now) and/or to postgres
   * @param name category name
   * @param type element type
   * @param content content to be saved
   * @returns Promise<Content>, saved content
   */
  async saveContentToMongoOrPg(name: string, type: string, content: Content) {
    try {
      const ct = await this.mongoService.saveContentToMongoOrPgByType(type, content)
      return this.saveContentInCategory(name, ct)
    }
    catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * save content to postgres
   * @param name category name
   * @param content content to be saved
   * @returns Promise<Content>, saved content
   */
  saveContentInCategory(name: string, content: Content) {
    let ctn = {}
    if (content.id) ctn = {id: content.id}
    if (content.element) ctn = {...ctn, element: content.element}
    if (content.mark) ctn = {...ctn, mark: content.mark}
    if (content.tags) ctn = {...ctn, tags: content.tags}
    if (content.author) ctn = {...ctn, author: content.author}
    if (content.config) ctn = {...ctn, config: content.config}
    if (content.storageType) ctn = {...ctn, storageType: content.storageType}
    if (content.tabId) ctn = {...ctn, tabId: content.tabId}
    ctn = {
      ...ctn,
      category: {name},
      date: moment(content.date, common.dateFormat),
      title: content.title,
      data: content.data,
    }
    const newContent = this.repo.create(ctn)
    return this.repo.save(newContent)
  }
}


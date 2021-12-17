import {Injectable} from '@nestjs/common'
import axios from 'axios'
import formData from 'form-data'
import moment from 'moment'
import * as common from "../common"
import {Content} from "../entity"
import {ConfigService} from "@nestjs/config"

export interface ContentMongo {
  id?: string
  elementId: string
  category?: string
  date: string
  data: Record<string, any>
  config?: Record<string, any>
}

export interface MData {
  id: string
  data: Record<string, any>
}

// const base = 'http://localhost:8089/api/mongo'
@Injectable()
export class MongoService {
  constructor(private configService: ConfigService) {
  }

  private getGoMongoApiPath() {
    const serverConfig = this.configService.get("server")

    return `http://${serverConfig.serverGoHost}:${serverConfig.serverGoPort}/api/mongo`
  }

  /**
   * save content to mongodb for certain element type.
   * @param type collection name, also known as element type
   * @param content content to be saved
   * @returns the content that will be saved to pg
   */
  async saveContentToMongoOrPgByType(type: string, content: Content) {
    switch (type) {
      case common.ElementType.Text:
        return this.saveContentToMongo(type, content)
      case common.ElementType.Image:
        return this.saveContentToMongo(type, content)
      case common.ElementType.FlexTable:
        // @deprecated
        // flexTable now only accepts data from dataset
        //
        // if (content?.config?.type === common.flexTableType.file)
        //   return this.saveContentToMongo(type, content)
        // else
        return content
      case common.ElementType.XlsxTable:
        return this.saveContentToMongo(type, content)
      default:
        return content
    }
  }

  /**
   * save content to mongoDB
   * @param type type collection name, also known as element type
   * @param content content to be saved
   * @returns the content w/ data as a pointer to actual data in mongoDB
   */
  async saveContentToMongo(type: string, content: Content) {
    //if has req body, save to mongodb
    if (content && content.data && content.element.id) {
      //convert content to the form to save to mongodb
      const mongoCt: ContentMongo = this.pgContentToMongoContent(content)
      // console.log("querying go api with content\n", mongoCt)
      //make query to go api
      try {
        const res = await this.createContent(type, mongoCt) as MData
        // console.log("receving go api response", res);
        content.data = {id: res.id, collection: type}
        content.storageType = common.StorageType.MONGO
      } catch (error) {
        throw error
      }
      return content
    }
    // if content is illegal, throw error
    throw new Error("content is undefined")
  }

  /**
   * convert the form of content to the request body datatype that could be processed by go-mongo-api
   * @param ct content to be converted
   * @returns converted content, the data will be sent to go-mongo-api
   */
  pgContentToMongoContent(ct: Content) {
    // elementId must be defined
    const eleId = ct.element.id
    // date format should match go api's date formate
    const mongoct: ContentMongo = {
      id: ct.data?.id, //mongodb object id, might not exist
      elementId: eleId,
      date: ct.date ?
        moment(ct.date, moment.defaultFormat).format() :
        moment().format(), //make sure date is always defined
      data: ct.data,
      category: ct.category?.name,
      config: ct.config
    }
    // console.log("mongoct", mongoct.date)
    return mongoct
  }

  async getContentData(type: string, id?: string, date?: string, elementId?: string) {
    const res = await this.getContent(type, id, date, elementId) as MData
    // console.log("receiving response from go api", res, res.data)
    return res.data
  }

  async getContent(type: string, id?: string, date?: string, elementId?: string) {
    const base = this.getGoMongoApiPath()
    let url = `${base}?type=${type}`
    //get by mongo id
    if (id) url += `&id=${id}`
    //get by elementId and date
    else if (elementId && date) url += `&elementId=${elementId}&date=${date}`
    else if (elementId) url += `&elementId=${elementId}`
    const ans = await axios.get(url)
    return ans.data
  }

  async createOrUpdateContentList(type: string, cts: ContentMongo[]) {
    const base = this.getGoMongoApiPath()
    let url = `${base}/saveUpdate?type=${type}`
    const form = new formData()
    const ans = await axios.post(url, cts, {headers: form.getHeaders()})
    return ans.data
  }

  async createContent(type: string, content: ContentMongo) {
    const base = this.getGoMongoApiPath()
    let url = `${base}?type=${type}`
    const form = new formData()
    const ans = await axios.post(url, content, {headers: form.getHeaders()})
    return ans.data
  }


  async updateContent(type: string, content: ContentMongo) {
    const base = this.getGoMongoApiPath()
    let url = `${base}?type=${type}`
    const form = new formData()
    const ans = await axios.put(url, content, {headers: form.getHeaders()})
    return ans.data
  }

  async deleteContent(type: string, id: string) {
    const base = this.getGoMongoApiPath()
    let url = `${base}?type=${type}&id=${id}`
    const ans = await axios.delete(url)
    return ans.data

  }

}

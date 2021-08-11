import { Injectable } from '@nestjs/common';
import axios from 'axios';
import formData from 'form-data';
import moment from 'moment';
import * as common from "../common"
import { Content, Element } from "../entity"

export interface ContentMongo {
    id: string
    elementId?: string
    category?: string
    date: string
    title: string
    data: Record<string, any>
    config?: Record<string, any>
}

const base = 'http://localhost:8089/api/mongo'
@Injectable()
export class MongoService {
    constructor() {
    }

    async saveContentToMongoOrPgByType(type: string, content: Content) {
        switch (type) {
            case common.ElementType.Text:
                return this.saveContentToMongo(type, content)
            case common.ElementType.Image:
                return this.saveContentToMongo(type, content)
            default:
                return content
        }
    }

    async saveContentToMongo(type: string, content: Content) {
        //if has req body, save to mongodb
        if (content) {
            //convert content to the form to save to mongodb
            const mongoCt: ContentMongo = this.pgContentToMongoContent(content)
            // console.log("querying go api with content", mongoCt)
            //make query to go api
            try {
                const res = await this.createContent(type, mongoCt);
                // console.log("receving go api response", res);
                content.data = { id: res.id, collection: type };
            } catch (error) {
                console.log(error);
            } finally {
                return content
            }
        }
        return content
    }
    pgContentToMongoContent(ct: Content) {
        // console.log("ct", ct.date)
        //date format should match go api's date formate
        const mongoct: ContentMongo = {
            id: ct.data?.id, //mongodb object id, might not exist
            elementId: ct.element?.id,
            date: ct.date ? moment(ct.date, moment.defaultFormat).format() : moment().format(), //make sure date is always defined
            data: ct.data,
            title: ct.title,
            category: ct.category?.name,
            config: ct.config
        }
        //  cts.push(mongoct)
        // console.log("mongoct", mongoct.date)
        return mongoct
    }

    async processElement(ele: Element) {
        let cts: ContentMongo[] = []
        switch (ele.type) {
            case common.ElementType.Image:
                break
            case common.ElementType.Text:
                cts = ele.contents.map(ct => {
                    // if (ct.data?.id) return ct
                    //get generated id from mongo db
                    const mongoct: ContentMongo = {
                        id: ct.data?.id, //mongodb object id, might not exist
                        elementId: ele.id,
                        date: ct.date ? ct.date : moment().toString(), //make sure date is always defined
                        data: ct.data,
                        title: ct.title,
                        category: ct.category.name,
                        config: ct.config
                    }
                    //  cts.push(mongoct)
                    return mongoct
                })
                break
            default://save to pg
                break
        }
        const res = await this.createOrUpdateContentList(ele.type, cts)
        ele.contents = res.map((r: { id: string; }) => {
            return { ...ele.contents, data: { id: r.id, type: ele.type } }
        })
        return ele
    }

    async getContent(type: string, id?: string, date?: string, elementId?: string) {
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
        let url = `${base}/saveUpdate?type=${type}`
        const form = new formData()
        const ans = await axios.post(url, cts, { headers: form.getHeaders() })
        return ans.data

    }

    async createContent(type: string, content: ContentMongo) {
        let url = `${base}?type=${type}`
        const form = new formData()
        const ans = await axios.post(url, content, { headers: form.getHeaders() })
        return ans.data
    }


    async updateContent(type: string, content: ContentMongo) {
        let url = `${base}?type=${type}`
        const form = new formData()
        const ans = await axios.put(url, content, { headers: form.getHeaders() })
        return ans.data
    }

    async deleteContent(type: string, id: string) {
        let url = `${base}?type=${type}&id=${id}`
        const ans = await axios.delete(url)
        return ans.data

    }

}
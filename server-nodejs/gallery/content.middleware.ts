// import { Injectable, NestMiddleware } from "@nestjs/common";

import {Injectable, NestMiddleware} from "@nestjs/common"
import {ElementType} from "./common"
import * as MongoService from "./provider/contentMongo.service"

@Injectable()
export class ContentMiddleware implements NestMiddleware {
  constructor(private readonly service: MongoService.MongoService) {}
  async use(req: Request, res: Response, next: Function) {
    //get type from query
    //hardcode http to have a validate url, req.url is in form "api/gallery/saveContentInCategory"
    const url = new URL("http://" + req.url)
    const type = url.searchParams.get("type")
    switch (type) {
      case ElementType.Text:
        //if has req body, save to mongodb
        if (req.body) {
          //convert content to the form to save to mongodb
          const mongoCt: MongoService.ContentMongo = this.service.pgContentToMongoContent(req.body as any)
          // console.log("querying go api with content", mongoCt)
          //make query to go api
          try {
            const res = await this.service.createContent(type, mongoCt) as MongoService.MData
            // console.log("receving go api response", res);
            (req.body as any).data = {id: res.id, collection: type}
          } catch (error) {
            console.log(error)
          } finally {
            next()
          }
        }

        break
      case ElementType.Image:
        break
      default:
        break
    }

    // console.log("in middleware", type)

    next()
  }
}

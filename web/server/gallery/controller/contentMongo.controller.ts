import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { Content } from "../entity";
import * as MongoService from "../provider/contentMongo.service";

export interface Req {
    type: string
    content: Content
}
@Controller()
export class ContentMongoController {
    constructor(private readonly service: MongoService.MongoService) { }

    @Get("mongoContent")
    getMongoContent(
        @Query("type") type: string,
        @Query("id") id: string,
        @Query("elementId") elementId: string,
        @Query("date") date: string) {
        return this.service.getContent(type, id, date, elementId)

    }

    @Post("mongoContent")
    createMongoContent(
        @Query("type") type: string,
        @Body() content: MongoService.ContentMongo
    ) {
        // return { content, type }
        return this.service.createContent(type, content)
    }

}
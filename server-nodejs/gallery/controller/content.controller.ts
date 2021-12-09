/**
 * Created by Jacob Xie on 8/29/2020.
 */

import {Body, Controller, Delete, Get, HttpException, HttpStatus, ParseArrayPipe, Post, Query} from '@nestjs/common'

import * as contentService from "../provider/content.service"
import * as common from "../common"
import {Content} from "../entity"
// import * as MongoService from "../provider/contentMongo.service"

@Controller()
export class ContentController {
    constructor(private readonly service: contentService.ContentService,
        // private readonly mongoService: MongoService.MongoService
    ) {}

    @Get("contents")
    getAllContents() {
        try {
            return this.service.getAllContents()
        } catch (err: any) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Get("content")
    getContentById(@Query("id") id: string) {
        try {
            return this.service.getContentById(id)
        } catch (err: any) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Post("content")
    saveContent(@Body() content: Content) {
        try {
            return this.service.saveContent(content)
        } catch (err: any) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Delete("content")
    deleteContent(@Query("id") id: string) {
        try {
            return this.service.deleteContent(id)
        } catch (err: any) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Delete("deleteContents")
    deleteContents(@Query("ids") ids: string) {
        try {
            let idList = ids.split(",")
            return this.service.deleteContents(idList)
        } catch (err: any) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    // ===================================================================================================================

    @Get("getContentsInCategoryByElementTypeAndMarkAndTags")
    getContentsInCategoryByElementTypeAndMarkAndTags(@Query("categoryName") categoryName: string,
        @Query("elementType") elementType?: common.ElementType,
        @Query("markName") markName?: string,
        @Query("tagNames") tagNames?: string[],
        @Query("pagination", new ParseArrayPipe({
            optional: true,
            items: Number,
            separator: ","
        })) pagination?: [number, number]) {
        try {
            return this.service
                .getContentsInCategoryByElementTypeAndMarkAndTags(
                    categoryName,
                    elementType,
                    markName,
                    tagNames,
                    pagination
                )
        } catch (err: any) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Get("getNestedElementContent")
    getNestedElementContent(@Query("contentId") contentId: string) {
        try {
            return this.service.getNestedElementContent(contentId)
        } catch (err: any) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Post("saveContentInCategory")
    saveContentInCategory(
        @Query("name") name: string,
        @Query("type") type: string,
        @Body() content: Content
    ) {
        // console.log(type, content)
        try {
            // return this.service.saveNestedOrSimpleContent(name, type, content)
            return this.service.saveContentToMongoOrPg(name, type, content)
        } catch (err: any) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}


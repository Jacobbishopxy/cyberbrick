/**
 * Created by Jacob Xie on 8/29/2020.
 */

import {Body, Controller, Delete, Get, HttpException, HttpStatus, ParseArrayPipe, Post, Query} from '@nestjs/common'

import * as contentService from "../provider/content.service"
import * as common from "../common"
import {Content} from "../entity"


@Controller()
export class ContentController {
  constructor(private readonly service: contentService.ContentService) {}

  @Get("contents")
  getAllContents() {
    try {
      return this.service.getAllContents()
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("content")
  getContentById(@Query("id") id: string) {
    try {
      return this.service.getContentById(id)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("content")
  saveContent(@Body() content: Content) {
    try {
      return this.service.saveContent(content)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Delete("content")
  deleteContent(@Query("id") id: string) {
    try {
      return this.service.deleteContent(id)
    } catch (err) {
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
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("saveContentInCategory")
  saveContentInCategory(@Query("name") name: string, @Body() content: Content) {
    try {
      return this.service.saveContentInCategory(name, content)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}


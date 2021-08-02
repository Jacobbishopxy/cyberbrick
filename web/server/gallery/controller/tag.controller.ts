/**
 * Created by Jacob Xie on 9/8/2020.
 */

import {Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Query} from '@nestjs/common'

import * as tagService from "../provider/tag.service"
import {Tag} from "../entity"
import {ParseArray} from "../pipe"


@Controller()
export class TagController {
  constructor(private readonly service: tagService.TagService) {}

  @Get("tags")
  getAllTags() {
    try {
      return this.service.getAllTags()
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("tag")
  getTagsByName(@Query("name") name: string) {
    try {
      return this.service.getTagsByName(name)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("tag")
  saveTag(@Body() tag: Tag) {
    try {
      return this.service.saveTag(tag)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Delete("tag")
  deleteTag(@Query("id") id: string) {
    try {
      return this.service.deleteTag(id)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  // ===================================================================================================================

  @Get("getCategoriesByTagName")
  getCategoriesByTagName(@Query("name") name: string) {
    try {
      return this.service.getCategoriesByTagName(name)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("modifyTag")
  modifyTag(@Body() tag: Tag) {
    try {
      return this.service.modifyTag(tag)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Delete("deleteTagInCategory")
  deleteTagInCategory(@Query("categoryName") categoryName: string,
    @Query("tagName") tagName: string) {
    try {
      return this.service.deleteTagInCategory(categoryName, tagName)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("saveTags")
  saveTags(@Body() tags: Tag[]) {
    try {
      return this.service.saveTags(tags)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Delete("deleteTags")
  deleteTags(@Query("ids", new ParseArray({type: String, separator: ","})) ids: string[]) {
    try {
      return this.service.deleteTags(ids)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("updateTagsInCategory")
  updateTagsInCategory(@Query("categoryName") categoryName: string,
    @Body() tags: Tag[]) {
    try {
      return this.service.updateTagsInCategory(categoryName, tags)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}


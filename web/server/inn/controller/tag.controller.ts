/**
 * Created by Jacob Xie on 2/4/2021
 */

import {Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Query} from '@nestjs/common'

import {Tag} from "../entity"
import {TagService} from "../provider"


@Controller()
export class TagController {
  constructor(private readonly service: TagService) {}

  @Get("tags")
  getAllTags() {
    try {
      return this.service.getAllTags()
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("tag")
  getTagById(@Query("id") id: string) {
    try {
      return this.service.getTagById(id)
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

  @Post("modifyTags")
  modifyTags(@Body() tags: Tag[]) {
    try {
      return this.service.modifyTags(tags)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}


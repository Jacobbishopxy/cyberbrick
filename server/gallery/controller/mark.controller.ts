/**
 * Created by Jacob Xie on 9/8/2020.
 */

import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Query } from '@nestjs/common'

import * as markService from "../provider/mark.service"
import { Mark } from "../entity"


@Controller()
export class MarkController {
  constructor(private readonly service: markService.MarkService) {}

  @Get("marks")
  getAllMarks() {
    try {
      return this.service.getAllMarks()
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("mark")
  getMarksByName(@Query("name") name: string) {
    try {
      return this.service.getMarksByName(name)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("mark")
  saveMark(@Body() mark: Mark) {
    try {
      return this.service.saveMark(mark)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Delete("mark")
  deleteMark(@Query("id") id: string) {
    try {
      return this.service.deleteMark(id)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  // ===================================================================================================================

  @Get("getCategoriesByMarkName")
  getCategoriesByMarkName(@Query("name") name: string) {
    try {
      return this.service.getCategoriesByMarkName(name)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Delete("deleteMarkInCategory")
  deleteMarkInCategory(@Query("categoryName") categoryName: string,
                       @Query("markName") markName: string) {
    try {
      return this.service.deleteMarkInCategory(categoryName, markName)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}


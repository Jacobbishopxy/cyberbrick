/**
 * Created by Jacob Xie on 8/29/2020.
 */

import {Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Query} from '@nestjs/common'

import * as elementService from "../provider/element.service"
import {Element} from "../entity"


@Controller()
export class ElementController {
  constructor(private readonly service: elementService.ElementService) {}

  @Get("elements")
  getAllElements() {
    try {
      return this.service.getAllElements()
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("element")
  getElementsByIds(@Query("ids") ids: string) {
    try {
      return this.service.getElementsByIds(ids.split(","))
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("element")
  saveElement(@Body() element: Element) {
    try {
      return this.service.saveElement(element)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Delete("element")
  deleteElement(@Query("id") id: string) {
    try {
      return this.service.deleteElement(id)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  // ===================================================================================================================

  @Get("getElementContentDates")
  getElementContentDates(
    @Query("id") id: string,
    @Query("markName") markName?: string
  ) {
    try {
      return this.service.getElementContentDates(id, markName)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("getElementContent")
  getElementContent(@Query("id") id: string,
    @Query("date") date?: string,
    @Query("markName") markName?: string) {
    try {
      return this.service.getElementContentAndFetchQuery(id, date, markName)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("modifyElement")
  modifyElement(@Query("id") id: string,
    @Body() element: Element) {
    try {
      return this.service.modifyElement(id, element)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("updateElements")
  updateElements(@Body() elements: Element[]) {
    try {
      return this.service.saveElements(elements)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}


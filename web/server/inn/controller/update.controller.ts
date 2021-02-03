/**
 * Created by Jacob Xie on 2/3/2021
 */

import {Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Query} from '@nestjs/common'

import {Update} from "../entity"
import {UpdateService} from "../provider"


@Controller()
export class UpdateController {
  constructor(private readonly service: UpdateService) {}

  @Get("updates")
  getAllUpdate() {
    try {
      return this.service.getAllUpdate()
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("update")
  getUpdateById(@Query("id") id: string) {
    try {
      return this.service.getUpdateById(id)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("update")
  saveUpdate(@Body() update: Update) {
    try {
      return this.service.saveUpdate(update)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Delete("update")
  deleteUpdate(@Query("id") id: string) {
    try {
      return this.service.deleteUpdate(id)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("getLatestUpdate")
  getLatestUpdate(@Query("pagination") pagination?: [number, number]) {
    try {
      return this.service.getLatestUpdate(pagination)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}


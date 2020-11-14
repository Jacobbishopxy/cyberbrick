/**
 * Created by Jacob Xie on 10/22/2020.
 */

import {Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Query} from '@nestjs/common'

import * as storageService from "../provider/storage.service"
import {Storage} from "../entity"


@Controller()
export class StorageController {
  constructor(private readonly service: storageService.StorageService) {}

  @Get("storages")
  getAllStorages() {
    try {
      return this.service.getAllStorages()
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("storage")
  getStorageById(@Query("id") id: string) {
    try {
      return this.service.getStorageById(id)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("storage")
  saveStorage(@Body() storage: Storage) {
    try {
      return this.service.saveStorage(storage)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Delete("storage")
  deleteStorage(@Query("id") id: string) {
    try {
      return this.service.deleteStorage(id)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  // ===================================================================================================================

  @Get("testConnection")
  testConnection(@Query("id") id: string) {
    return this.service.testConnection(id)
  }

  @Get("reloadConnection")
  reloadConnection(@Query("id") id: string) {
    return this.service.reloadConnection(id)
  }

  @Get("executeSql")
  executeSql(@Query("id") id: string,
             @Query("sqlString") sqlString: string) {
    try {
      return this.service.executeSql(id, sqlString)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  // todo: read Post
}


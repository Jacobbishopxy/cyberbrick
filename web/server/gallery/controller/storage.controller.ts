/**
 * Created by Jacob Xie on 10/22/2020.
 */

import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Query } from '@nestjs/common'

import * as storageService from "../provider/storage.service"
import { Storage } from "../entity"
import { ReadDto } from "../dto"
import { ReadPipe } from "../pipe"


@Controller()
export class StorageController {
  constructor(private readonly service: storageService.StorageService) { }

  @Get("storages")
  getAllStorages() {
    try {
      return this.service.getAllStorages()
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("storage")
  getStorageById(@Query("id") id: string) {
    try {
      return this.service.getStorageById(id)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("storage")
  saveStorage(@Body() storage: Storage) {
    try {
      return this.service.saveStorage(storage)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Delete("storage")
  deleteStorage(@Query("id") id: string) {
    try {
      return this.service.deleteStorage(id)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  // ===================================================================================================================

  @Get("getAllStorageSimple")
  getAllStorageSimple() {
    return this.service.getAllStorageSimple()
  }

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
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("read")
  read(@Query("id") id: string, @Query("databaseType") databaseType: string,
    @Body(ReadPipe) readDto: ReadDto) {
    try {
      return this.service.readFromDB(id, readDto, databaseType)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}


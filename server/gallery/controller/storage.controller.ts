/**
 * Created by Jacob Xie on 10/22/2020.
 */

import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Query } from '@nestjs/common'
import { Request, Response } from "express"

import * as storageService from "../service/storage.service"
import * as utils from "../../utils"
import { Storage } from "../entity/Storage"

export async function getAllStorages(req: Request, res: Response) {
  const ans = await storageService.getAllStorages()

  res.send(ans)
}

export async function getStorageByName(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const id = req.query.id as string
  const ans = await storageService.getStorageById(id)

  res.send(ans)
}

export async function saveStorage(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await storageService.saveStorage(req.body as Storage)

  res.status(ans).end()
}

export async function deleteStorage(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const id = req.query.id as string
  const ans = await storageService.deleteStorage(id)

  res.sendStatus(ans)
}

// =====================================================================================================================

export async function executeSql(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const id = req.query.id as string
  const sqlString = req.query.sqlString as string
  const ans = await storageService.executeSql(id, sqlString)

  res.send(ans)
}

@Controller("gallery")
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
  getStorageByName(@Query("id") id: string) {
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

  @Get("executeSql")
  executeSql(@Query("id") id: string,
             @Query("sqlString") sqlString: string) {
    try {
      return this.service.executeSql(id, sqlString)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}


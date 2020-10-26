/**
 * Created by Jacob Xie on 9/8/2020.
 */

import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Query } from '@nestjs/common'
import { Request, Response } from "express"

import * as markService from "../service/mark.service"
import * as utils from "../../utils"
import { Mark } from "../entity/Mark"


export async function getAllMarks(req: Request, res: Response) {
  const ans = await markService.getAllMarks()
  res.send(ans)
}

export async function getMarksByName(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await markService.getMarksByName(req.query.name as string)
  res.send(ans)
}

export async function saveMark(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await markService.saveMark(req.body as Mark)
  res.status(ans).end()
}

export async function deleteMark(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await markService.deleteMark(req.query.id as string)
  res.status(ans).end()
}

// =====================================================================================================================


export async function getCategoriesByMarkName(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await markService.getCategoriesByMarkName(req.query.name as string)
  res.send(ans)
}

export async function deleteMarkInCategory(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const categoryName = req.query.categoryName as string
  const markName = req.query.markName as string
  const ans = await markService.deleteMarkInCategory(categoryName, markName)
  res.status(ans).end()
}

@Controller("gallery")
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


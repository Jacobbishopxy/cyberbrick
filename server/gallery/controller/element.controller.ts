/**
 * Created by Jacob Xie on 8/29/2020.
 */

import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Query } from '@nestjs/common'
import { Request, Response } from "express"

import * as elementService from "../provider/element.service"
import * as utils from "../../utils"
import { Element } from "../entity/element.entity"


export async function getAllElements(req: Request, res: Response) {
  const ans = await elementService.getAllElements()

  res.send(ans)
}

export async function getElementsByIds(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ids = (req.query.ids as string).split(",")
  const ans = await elementService.getElementsByIds(ids)

  res.send(ans)
}

export async function saveElement(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await elementService.saveElement(req.body as Element)

  res.status(ans).end()
}

export async function deleteElement(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await elementService.deleteElement(req.query.id as string)

  res.status(ans).end()
}

// =====================================================================================================================


export async function getElementContentDates(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const id = req.query.id as string
  const markName = req.query.markName as utils.QueryStr
  const ans = await elementService.getElementContentDates(id, markName)

  res.send(ans)
}

export async function getElementContent(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const id = req.query.id as string
  const date = req.query.date as utils.QueryStr
  const markName = req.query.markName as utils.QueryStr

  const ans = await elementService.getElementContent(id, date, markName)

  res.send(ans)
}

@Controller()
export class ElementController {
  constructor(private readonly service: elementService.ElementService) {}

  @Get("elements")
  getAllElements() {
    try {
      return this.service.getAllElements()
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("element")
  getElementsByIds(@Query("ids") ids: string) {
    try {
      return this.service.getElementsByIds(ids.split(","))
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("element")
  saveElement(@Body() element: Element) {
    try {
      return this.service.saveElement(element)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Delete("element")
  deleteElement(@Query("id") id: string) {
    try {
      return this.service.deleteElement(id)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  // ===================================================================================================================

  @Get("getElementContentDates")
  getElementContentDates(@Query("id") id: string,
                         @Query("markName") markName?: string) {
    try {
      return this.service.getElementContentDates(id, markName)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("getElementContent")
  getElementContent(@Query("id") id: string,
                    @Query("date") date?: string,
                    @Query("markName") markName?: string) {
    try {
      return this.service.getElementContent(id, date, markName)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}


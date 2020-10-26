/**
 * Created by Jacob Xie on 8/29/2020.
 */

import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Query } from '@nestjs/common'
import { Request, Response } from "express"

import * as contentService from "../provider/content.service"
import * as utils from "../../utils"
import * as common from "../common"
import { Content } from "../entity/content.entity"


export async function getAllContents(req: Request, res: Response) {
  const ans = await contentService.getAllContents()

  res.send(ans)
}

export async function getContentById(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await contentService.getContentById(req.query.id as string)

  res.send(ans)
}

export async function saveContent(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await contentService.saveContent(req.body as Content)
  res.status(ans).end()
}

export async function deleteContent(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await contentService.deleteContent(req.query.id as string)

  res.status(ans).end()
}

// =====================================================================================================================


export async function getContentsInCategoryByElementTypeAndMarkAndTags(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const categoryName = req.query.categoryName as string
  const elementType = req.query.elementType as utils.QueryStr
  const et = elementType ? common.getElementType(elementType) : undefined
  const markName = req.query.markName as utils.QueryStr
  const tagNames = req.query.tagNames as utils.QueryStr
  const tn = tagNames ? tagNames.split(",") : undefined
  const pagination = req.query.pagination as utils.QueryStr
  const pn = utils.paginationExtract(pagination)
  const ans = await contentService
    .getContentsInCategoryByElementTypeAndMarkAndTags(categoryName, et, markName, tn, pn)

  res.send(ans)
}

export async function saveContentInCategory(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await contentService.saveContentInCategory(req.query.name as string, req.body as Content)

  res.status(ans).end()
}

@Controller("gallery")
export class ContentController {
  constructor(private readonly service: contentService.ContentService) {}

  @Get("contents")
  getAllContents() {
    try {
      return this.service.getAllContents()
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("content")
  getContentById(@Query("id") id: string) {
    try {
      return this.service.getContentById(id)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("content")
  saveContent(@Body() content: Content) {
    try {
      return this.service.saveContent(content)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Delete("content")
  deleteContent(@Query("id") id: string) {
    try {
      return this.service.deleteContent(id)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  // ===================================================================================================================

  @Get("getContentsInCategoryByElementTypeAndMarkAndTags")
  getContentsInCategoryByElementTypeAndMarkAndTags(@Query("categoryName") categoryName: string,
                                                   @Query("elementType") elementType?: common.ElementType,
                                                   @Query("markName") markName?: string,
                                                   @Query("tagNames") tagNames?: string[],
                                                   @Query("pagination") pagination?: [number, number]) {
    try {
      return this.service
        .getContentsInCategoryByElementTypeAndMarkAndTags(
          categoryName,
          elementType,
          markName,
          tagNames,
          pagination
        )
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("saveContentInCategory")
  saveContentInCategory(@Query("name") name: string, @Body() content: Content) {
    try {
      return this.service.saveContentInCategory(name, content)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}


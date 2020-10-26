/**
 * Created by Jacob Xie on 9/8/2020.
 */

import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Query } from '@nestjs/common'
import { Request, Response } from "express"

import * as tagService from "../provider/tag.service"
import * as utils from "../../utils"
import { Tag } from "../entity/tag.entity"


export async function getAllTags(req: Request, res: Response) {
  const ans = await tagService.getAllTags()
  res.send(ans)
}

export async function getTagsByName(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await tagService.getTagsByName(req.query.name as string)
  res.send(ans)
}

export async function saveTag(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await tagService.saveTag(req.body as Tag)
  res.status(ans).end()
}

export async function deleteTag(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await tagService.deleteTag(req.query.id as string)
  res.status(ans).end()
}

// =====================================================================================================================


export async function getCategoriesByTagName(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await tagService.getCategoriesByTagName(req.query.name as string)
  res.send(ans)
}

export async function deleteTagInCategory(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const categoryName = req.query.categoryName as string
  const tagName = req.query.tagName as string
  const ans = await tagService.deleteTagInCategory(categoryName, tagName)
  res.status(ans).end()
}

@Controller("gallery")
export class TagController {
  constructor(private readonly service: tagService.TagService) {}

  @Get("tags")
  getAllTags() {
    try {
      return this.service.getAllTags()
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("tag")
  getTagsByName(@Query("name") name: string) {
    try {
      return this.service.getTagsByName(name)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("tag")
  saveTag(@Body() tag: Tag) {
    try {
      return this.service.saveTag(tag)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Delete("tag")
  deleteTag(@Query("id") id: string) {
    try {
      return this.service.deleteTag(id)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  // ===================================================================================================================

  @Get("getCategoriesByTagName")
  getCategoriesByTagName(@Query("name") name: string) {
    try {
      return this.service.getCategoriesByTagName(name)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Delete("deleteTagInCategory")
  deleteTagInCategory(@Query("categoryName") categoryName: string,
                      @Query("tagName") tagName: string) {
    try {
      return this.service.deleteTagInCategory(categoryName, tagName)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}


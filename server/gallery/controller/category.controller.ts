/**
 * Created by Jacob Xie on 9/14/2020.
 */

import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Query } from '@nestjs/common'
import { Request, Response } from "express"

import { CategoryPureDto } from "./category.dto"
import * as categoryService from "../provider/category.service"
import * as utils from "../../utils"
import { Category } from "../entity/category.entity"
import { Mark } from "../entity/mark.entity"
import { Tag } from "../entity/tag.entity"

export async function getAllCategories(req: Request, res: Response) {
  const ans = await categoryService.getAllCategories()
  res.send(ans)
}

export async function getCategoryByName(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await categoryService.getCategoryByName(req.query.name as string)
  res.send(ans)
}

export async function saveCategory(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await categoryService.saveCategory(req.body as Category)
  res.status(ans).end()
}

export async function deleteCategory(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const name = req.query.name as string
  const ans = await categoryService.deleteCategory(name)
  res.status(ans).end()
}

// =====================================================================================================================


export async function getAllCategoriesName(req: Request, res: Response) {
  const ans = await categoryService.getAllCategoriesName()

  res.send(ans)
}

export async function getAllCategoriesWithoutContents(req: Request, res: Response) {
  const ans = await categoryService.getAllCategoriesWithoutContents()

  res.send(ans)
}

export async function getCategoryMarkAndTagByName(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await categoryService.getCategoryMarkAndTagByName(req.query.name as string)
  res.send(ans)
}

export async function getCategoryContentByName(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await categoryService.getCategoryContentByName(req.query.name as string)
  res.send(ans)
}

export async function savePureCategory(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const cat = {
    name: req.body.name as string,
    description: req.body.description as string
  } as Category
  const ans = await categoryService.saveCategory(cat)
  res.status(ans).end()
}

export async function saveCategoryMark(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await categoryService.saveCategoryMark(req.query.name as string, req.body as Mark)
  res.status(ans).end()
}

export async function saveCategoryTag(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await categoryService.saveCategoryTag(req.query.name as string, req.body as Tag)
  res.status(ans).end()
}

@Controller("gallery")
export class CategoryController {
  constructor(private readonly service: categoryService.CategoryService) {}

  @Get("categories")
  getAllCategories() {
    try {
      return this.service.getAllCategories()
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("category")
  getCategoryByName(@Query("name") name: string) {
    try {
      return this.service.getCategoryByName(name)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("category")
  saveCategory(@Body() category: Category) {
    try {
      return this.service.saveCategory(category)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Delete("category")
  deleteCategory(@Query("name") name: string) {
    try {
      return this.service.deleteCategory(name)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  // ===================================================================================================================

  @Get("getAllCategoriesName")
  getAllCategoriesName() {
    try {
      return this.service.getAllCategoriesName()
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("getAllCategoriesWithoutContents")
  getAllCategoriesWithoutContents() {
    try {
      return this.service.getAllCategoriesWithoutContents()
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("getCategoryMarkAndTagByName")
  getCategoryMarkAndTagByName(@Query("name") name: string) {
    try {
      return this.service.getCategoryMarkAndTagByName(name)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("getCategoryContentByName")
  getCategoryContentByName(@Query("name") name: string) {
    try {
      return this.service.getCategoryContentByName(name)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("saveCategory")
  savePureCategory(@Body() category: CategoryPureDto) {
    try {
      return this.service.saveCategory(category as Category)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("saveCategoryMark")
  saveCategoryMark(@Query("name") name: string,
                   @Body() mark: Mark) {
    try {
      return this.service.saveCategoryMark(name, mark)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("saveCategoryTag")
  saveCategoryTag(@Query("name") name: string,
                  @Body() tag: Tag) {
    try {
      return this.service.saveCategoryTag(name, tag)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}


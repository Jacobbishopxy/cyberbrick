/**
 * Created by Jacob Xie on 9/14/2020.
 */

import {Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Query} from '@nestjs/common'

import * as categoryService from "../provider/category.service"
import {Category, Mark, Tag} from "../entity"
import {CategoryPureDto} from "../dto"
import {CategoryPurePipe} from "../pipe"


@Controller()
export class CategoryController {
  constructor(private readonly service: categoryService.CategoryService) {}

  @Get("categories")
  getAllCategories() {
    try {
      return this.service.getAllCategories()
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("category")
  getCategoryByName(@Query("name") name: string) {
    try {
      return this.service.getCategoryByName(name)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("category")
  saveCategory(@Body() category: Category) {
    try {
      return this.service.saveCategory(category)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Delete("category")
  deleteCategory(@Query("name") name: string) {
    try {
      return this.service.deleteCategory(name)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  // ===================================================================================================================

  @Get("getAllCategoriesByType")
  getAllCategoriesByType(@Query("type") type: string) {
    try {
      return this.service.getAllCategoriesByType(type)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("getAllCategories")
  getAllCategoriesName() {
    try {
      return this.service.getAllCategoriesNameWithType()
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("getAllCategoriesWithoutContents")
  getAllCategoriesWithoutContents() {
    try {
      return this.service.getAllCategoriesWithoutContents()
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("getAllCategoriesDashboardsTemplates")
  getAllCategoriesDashboardsTemplates() {
    try {
      return this.service.getAllCategoriesDashboardsTemplates()
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("getCategoryMarkAndTagByName")
  getCategoryMarkAndTagByName(@Query("name") name: string) {
    try {
      return this.service.getCategoryMarkAndTagByName(name)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("getCategoryContentByName")
  getCategoryContentByName(@Query("name") name: string) {
    try {
      return this.service.getCategoryContentByName(name)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("getCategoryDashboardByName")
  getCategoryDashboardByName(@Query("name") name: string) {
    try {
      return this.service.getCategoryDashboardByName(name)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("saveCategory")
  savePureCategory(@Body(CategoryPurePipe) category: CategoryPureDto) {
    try {
      return this.service.saveCategory(category as Category)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("saveCategoryMark")
  saveCategoryMark(@Query("name") name: string,
    @Body() mark: Mark) {
    try {
      return this.service.saveCategoryMark(name, mark)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("saveCategoryTag")
  saveCategoryTag(@Query("name") name: string,
    @Body() tag: Tag) {
    try {
      return this.service.saveCategoryTag(name, tag)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}


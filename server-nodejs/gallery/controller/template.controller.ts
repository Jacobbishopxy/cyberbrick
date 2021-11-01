/**
 * Created by Jacob Xie on 8/29/2020.
 */

import {Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Query} from '@nestjs/common'

import * as templateService from "../provider/template.service"
import {Template} from "../entity"
import {TemplateCopyElementsDto} from "../dto"
import {TemplateCopyElementsPipe, ParseArray} from "../pipe"


@Controller()
export class TemplateController {
  constructor(private readonly service: templateService.TemplateService) {}

  @Get("templates")
  getAllTemplates() {
    try {
      return this.service.getAllTemplates()
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("template")
  getTemplateById(@Query("id") id: string) {
    try {
      return this.service.getTemplateById(id)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("template")
  saveTemplate(@Body() template: Template) {
    try {
      return this.service.saveTemplate(template)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Delete("template")
  deleteTemplate(@Query("id") id: string) {
    try {
      return this.service.deleteTemplate(id)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  // ===================================================================================================================

  @Get("getTemplateElementsContents")
  getTemplateElementsContents(@Query("id") id: string) {
    try {
      return this.service.getTemplateElementsContents(id)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("getTemplateElements")
  getTemplateElements(@Query("id") id: string, @Query("isSubmodule") isSubmodule?: boolean) {
    try {
      return this.service.getTemplateElements(id, isSubmodule)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("saveTemplateInDashboard")
  saveTemplateInDashboard(@Query("id") id: string,
    @Body() template: Template) {
    try {
      return this.service.saveTemplateInDashboard(id, template)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("saveTemplatesInDashboard")
  saveTemplatesInDashboard(@Query("id") id: string,
    @Body() templates: Template[]) {
    try {
      return this.service.saveTemplatesInDashboard(id, templates)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Delete("deleteTemplatesInDashboard")
  deleteTemplatesInDashboard(@Query("ids", new ParseArray({type: String, separator: ","})) ids: string[]) {
    try {
      return this.service.deleteTemplatesInDashboard(ids)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("updateTemplatesInDashboard")
  updateTemplatesInDashboard(@Query("id") dashboardId: string,
    @Body() templates: Template[]) {
    try {
      return this.service.updateTemplatesInDashboard(dashboardId, templates)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("modifyTemplate")
  modifyTemplate(@Query("id") id: string,
    @Body() template: Template) {
    try {
      return this.service.modifyTemplate(id, template)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("copyTemplateElements")
  copyTemplateElements(@Body(TemplateCopyElementsPipe) cpy: TemplateCopyElementsDto) {
    try {
      return this.service
        .copyTemplateElements(
          cpy.originTemplateId,
          cpy.targetTemplateId,
        )
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("updateTemplateElements")
  updateTemplateElements(@Body() template: Template) {
    try {
      return this.service.updateTemplateElements(template)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}


/**
 * Created by Jacob Xie on 8/29/2020.
 */

import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Query } from '@nestjs/common'

import { TemplateCopyElementsDto } from "./template.dto"
import * as templateService from "../provider/template.service"
import { Template } from "../entity"


@Controller()
export class TemplateController {
  constructor(private readonly service: templateService.TemplateService) {}

  @Get("templates")
  getAllTemplates() {
    try {
      return this.service.getAllTemplates()
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("template")
  getTemplateById(@Query("id") id: string) {
    try {
      return this.service.getTemplateById(id)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("template")
  saveTemplate(@Body() template: Template) {
    try {
      return this.service.saveTemplate(template)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Delete("template")
  deleteTemplate(@Query("id") id: string) {
    try {
      return this.service.deleteTemplate(id)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  // ===================================================================================================================

  @Get("getTemplateElementsContents")
  getTemplateElementsContents(@Query("dashboardName") dashboardName: string,
                              @Query("templateName") templateName: string) {
    try {
      return this.service.getTemplateElementsContents(dashboardName, templateName)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("getTemplateElements")
  getTemplateElements(@Query("dashboardName") dashboardName: string,
                      @Query("templateName") templateName: string) {
    try {
      return this.service.getTemplateElements(dashboardName, templateName)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("saveTemplateInDashboard")
  saveTemplateInDashboard(@Query("dashboardName") dashboardName: string,
                          @Body() template: Template) {
    try {
      return this.service.saveTemplateInDashboard(dashboardName, template)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Delete("deleteTemplateInDashboard")
  deleteTemplateInDashboard(@Query("dashboardName") dashboardName: string,
                            @Query("templateName") templateName: string) {
    try {
      return this.service.deleteTemplateInDashboard(dashboardName, templateName)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("copyTemplateElements")
  copyTemplateElements(@Body() cpy: TemplateCopyElementsDto) {
    try {
      return this.service
        .copyTemplateElements(
          cpy.originDashboardName,
          cpy.originTemplateName,
          cpy.targetDashboardName,
          cpy.targetTemplateName
        )
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("updateTemplateElements")
  updateTemplateElements(@Body() template: Template) {
    try {
      return this.service.updateTemplateElements(template)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}


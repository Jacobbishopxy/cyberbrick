/**
 * Created by Jacob Xie on 8/29/2020.
 */

import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Query } from '@nestjs/common'
import { Request, Response } from "express"

import { TemplateCopyElementsDto } from "./template.dto"
import * as templateService from "../provider/template.service"
import * as utils from "../../utils"
import { Template } from "../entity/template.entity"


export async function getAllTemplates(req: Request, res: Response) {
  const ans = await templateService.getAllTemplates()

  res.send(ans)
}

export async function getTemplateById(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await templateService.getTemplateById(req.query.id as string)

  res.send(ans)
}

export async function saveTemplate(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await templateService.saveTemplate(req.body as Template)
  res.status(ans).end()
}

export async function deleteTemplate(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await templateService.deleteTemplate(req.query.id as string)

  res.status(ans).end()
}

// =====================================================================================================================

export async function getTemplateElementsContents(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const dashboardName = req.query.dashboardName as string
  const templateName = req.query.templateName as string

  const ans = await templateService.getTemplateElementsContents(dashboardName, templateName)

  res.send(ans)
}

export async function getTemplateElements(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const dashboardName = req.query.dashboardName as string
  const templateName = req.query.templateName as string

  const ans = await templateService.getTemplateElements(dashboardName, templateName)

  res.send(ans)
}

export async function saveTemplateInDashboard(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const dashboardName = req.query.dashboardName as string
  const template = req.body as Template

  const ans = await templateService.saveTemplateInDashboard(dashboardName, template)

  res.status(ans).end()
}

export async function deleteTemplateInDashboard(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const dashboardName = req.query.dashboardName as string
  const templateName = req.query.templateName as string

  const ans = await templateService.deleteTemplateInDashboard(dashboardName, templateName)

  res.status(ans).end()
}

export async function copyTemplateElements(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const originDashboardName = req.body.originDashboardName as string
  const originTemplateName = req.body.originTemplateName as string
  const targetDashboardName = req.body.targetDashboardName as string
  const targetTemplateName = req.body.targetTemplateName as string

  const ans = await templateService.copyTemplateElements(
    originDashboardName,
    originTemplateName,
    targetDashboardName,
    targetTemplateName
  )

  res.status(ans).end()
}

export async function updateTemplateElements(req: Request, res: Response) {

  const ans = await templateService.updateTemplateElements(req.body as Template)
  res.status(ans).end()
}

@Controller("gallery")
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


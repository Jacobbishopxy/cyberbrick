/**
 * Created by Jacob Xie on 8/29/2020.
 */

import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Query } from '@nestjs/common'
import { Request, Response } from "express"

import { DashboardDescriptionModifyDto } from "./dashboard.dto"
import * as dashboardService from "../service/dashboard.service"
import * as utils from "../../utils"
import { Dashboard } from "../entity/Dashboard"


export async function getAllDashboards(req: Request, res: Response) {
  const ans = await dashboardService.getAllDashboards()

  res.send(ans)
}

export async function getDashboardByName(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await dashboardService.getDashboardByName(req.query.name as string)

  res.send(ans)
}

export async function saveDashboard(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await dashboardService.saveDashboard(req.body as Dashboard)

  res.status(ans).end()
}

export async function deleteDashboard(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await dashboardService.deleteDashboard(req.query.name as string)

  res.status(ans).end()
}

// =====================================================================================================================


export async function getAllDashboardsName(req: Request, res: Response) {
  const ans = await dashboardService.getAllDashboardsName()

  res.send(ans)
}

export async function getAllDashboardsTemplate(req: Request, res: Response) {
  const ans = await dashboardService.getAllDashboardsTemplate()

  res.send(ans)
}

export async function getDashboardCategoryMarksAndTemplateByName(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const dashboardName = req.query.dashboardName as string
  const ans = await dashboardService.getDashboardCategoryMarksAndTemplateByName(dashboardName)

  res.send(ans)
}

export async function modifyDashboardDescription(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const dashboardName = req.body.name as string
  const description = req.body.description as string
  const ans = await dashboardService.modifyDashboardDescription(dashboardName, description)

  res.status(ans).end()
}

export async function newDashboardAttachToEmptyCategory(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const categoryName = req.query.categoryName as string
  const dashboard = req.body as Dashboard

  const ans = await dashboardService.newDashboardAttachToEmptyCategory(categoryName, dashboard)

  res.status(ans).end()
}

@Controller("gallery")
export class DashboardController {
  constructor(private readonly service: dashboardService.DashboardService) {}

  @Get("dashboards")
  getAllDashboards() {
    try {
      return this.service.getAllDashboards()
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("dashboard")
  getDashboardByName(@Query("name") name: string) {
    try {
      return this.service.getDashboardByName(name)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("dashboard")
  saveDashboard(@Body() dashboard: Dashboard) {
    try {
      return this.service.saveDashboard(dashboard)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Delete("dashboard")
  deleteDashboard(@Query("name") name: string) {
    try {
      return this.service.deleteDashboard(name)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  // ===================================================================================================================

  @Get("getAllDashboardsName")
  getAllDashboardsName() {
    try {
      return this.service.getAllDashboardsName()
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("getAllDashboardsTemplate")
  getAllDashboardsTemplate() {
    try {
      return this.service.getAllDashboardsTemplate()
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("getDashboardCategoryMarksAndTemplateByName")
  getDashboardCategoryMarksAndTemplateByName(@Query("dashboardName") dashboardName: string) {
    try {
      return this.service.getDashboardCategoryMarksAndTemplateByName(dashboardName)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("modifyDashboardDescription")
  modifyDashboardDescription(@Body() dashboard: DashboardDescriptionModifyDto) {
    try {
      return this.service.modifyDashboardDescription(dashboard.name, dashboard.description)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("DashboardDescriptionModifyDto")
  newDashboardAttachToEmptyCategory(@Query("categoryName") categoryName: string,
                                    @Body() dashboard: Dashboard) {
    try {
      return this.service.newDashboardAttachToEmptyCategory(categoryName, dashboard)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}


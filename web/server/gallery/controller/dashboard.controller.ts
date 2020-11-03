/**
 * Created by Jacob Xie on 8/29/2020.
 */

import {Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Query} from '@nestjs/common'

import {DashboardDescriptionModifyDto} from "./dashboard.dto"
import * as dashboardService from "../provider/dashboard.service"
import {Dashboard} from "../entity"


@Controller()
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

  @Post("newDashboardAttachToEmptyCategory")
  newDashboardAttachToEmptyCategory(@Query("categoryName") categoryName: string,
                                    @Body() dashboard: Dashboard) {
    try {
      return this.service.newDashboardAttachToEmptyCategory(categoryName, dashboard)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}


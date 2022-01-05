/**
 * Created by Jacob Xie on 8/29/2020.
 */

import {Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Query} from '@nestjs/common'

import * as dashboardService from "../provider/dashboard.service"
import {Dashboard} from "../entity"
import {DashboardModifyDto} from "../dto"
import {DashboardModifyPipe, ParseArray} from "../pipe"


@Controller()
export class DashboardController {
  constructor(private readonly service: dashboardService.DashboardService) {}

  @Get("dashboards")
  getAllDashboards() {
    try {
      return this.service.getAllDashboards()
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("dashboard")
  getDashboardByName(@Query("name") name: string) {
    try {
      return this.service.getDashboardById(name)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("dashboard")
  saveDashboard(@Body() dashboard: Dashboard) {
    try {
      return this.service.saveDashboard(dashboard)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Delete("dashboard")
  deleteDashboard(@Query("name") name: string) {
    try {
      return this.service.deleteDashboard(name)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  // ===================================================================================================================

  @Get("getAllDashboardsTemplate")
  getAllDashboardsTemplate() {
    try {
      return this.service.getAllDashboardsTemplate()
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("getDashboardCategoryAndTemplate")
  getDashboardCategoryAndTemplate(@Query("id") id: string) {
    try {
      return this.service.getDashboardCategoryAndTemplate(id)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("modifyDashboard")
  modifyDashboard(@Body(DashboardModifyPipe) dashboard: DashboardModifyDto) {
    try {
      return this.service.modifyDashboard(dashboard as Dashboard)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("newDashboardAttachToCategory")
  newDashboardAttachToCategory(@Query("categoryName") categoryName: string,
    @Body() dashboard: Dashboard) {
    try {
      return this.service.newDashboardAttachToCategory(categoryName, dashboard)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Delete("deleteDashboardInCategory")
  deleteDashboardInCategory(@Query("categoryName") categoryName: string,
    @Query("dashboardName") dashboardName: string) {
    try {
      return this.service.deleteDashboardInCategory(categoryName, dashboardName)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("saveDashboards")
  saveDashboards(@Body() dashboards: Dashboard[]) {
    try {
      return this.service.saveDashboards(dashboards)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Delete("deleteDashboards")
  deleteDashboards(@Query("ids", new ParseArray({type: String, separator: ","})) ids: string[]) {
    try {
      return this.service.deleteDashboards(ids)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("updateDashboardsInCategory")
  updateDashboardsInCategory(@Query("categoryName") categoryName: string,
    @Body() dashboards: Dashboard[]) {
    try {
      return this.service.updateDashboardsInCategory(categoryName, dashboards)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("searchDashboards")
  searchDashboards(@Query("keyword") keyword: string) {
    try {
      return this.service.searchDashboards(keyword)
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}


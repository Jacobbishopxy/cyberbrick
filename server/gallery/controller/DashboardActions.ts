/**
 * Created by Jacob Xie on 8/29/2020.
 */

import { Request, Response } from "express"

import * as dashboardService from "../service/DashboardService"
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


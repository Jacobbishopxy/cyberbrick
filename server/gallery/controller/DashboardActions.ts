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

export async function getDashboardTemplateElementsByName(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const dashboardName = req.query.dashboardName as string
  const templateName = req.query.templateName as string
  const ans = await dashboardService.getDashboardTemplateElementsByName(dashboardName, templateName)

  res.send(ans)
}

export async function newDashboardAttachToEmptyCategory(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const categoryName = req.query.categoryName as string
  const dashboard = req.body as Dashboard

  const ans = await dashboardService.newDashboardAttachToEmptyCategory(categoryName, dashboard)

  res.status(ans).end()
}


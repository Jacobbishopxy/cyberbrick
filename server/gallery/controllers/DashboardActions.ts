/**
 * Created by Jacob Xie on 8/29/2020.
 */

import { Request, Response } from "express"
import { getRepository } from "typeorm"

import * as common from "../common"
import * as utils from "../../utils"
import { Dashboard } from "../entities/Dashboard"


const dashboardRepo = () => getRepository(Dashboard)

const templateRelations = {
  relations: [common.templates]
}
const templateAndElementRelations = {
  relations: [common.templates, common.templatesElements]
}
const fullRelations = {
  relations: [
    common.templates,
    common.templatesElements,
    common.templatesElementsContents
  ]
}

export async function getAllDashboards(req: Request, res: Response) {
  const ans = await dashboardRepo().find(fullRelations)

  res.send(ans)
}

export async function getDashboardByName(req: Request, res: Response) {
  const ans = await dashboardRepo().findOne({
    ...templateRelations,
    ...utils.whereNameEqual(req.query.name as string)
  })

  res.send(ans)
}

export async function saveDashboard(req: Request, res: Response) {

  if (utils.expressErrorsBreak(req, res)) return

  const dr = dashboardRepo()
  const newDashboard = dr.create(req.body)
  await dr.save(newDashboard)

  res.send(newDashboard)
}

export async function deleteDashboard(req: Request, res: Response) {

  if (utils.expressErrorsBreak(req, res)) return

  const ans = dashboardRepo().delete(req.query.name as string)

  res.send(ans)
}

// =====================================================================================================================

export async function getDashboardTemplateElementsByName(req: Request, res: Response) {

  if (utils.expressErrorsBreak(req, res)) return

  const dashboardName = req.query.dashboardName as string
  const templateName = req.query.templateName as string

  const ans = await dashboardRepo().findOne({
    ...templateAndElementRelations,
    ...common.whereDashboardAndTemplateNameEqual(dashboardName, templateName)
  })

  res.send(ans)
}


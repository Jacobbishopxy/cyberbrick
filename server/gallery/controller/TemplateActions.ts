/**
 * Created by Jacob Xie on 8/29/2020.
 */

import { Request, Response } from "express"

import * as templateService from "../service/TemplateService"
import * as utils from "../../utils"
import { Template } from "../entity/Template"


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


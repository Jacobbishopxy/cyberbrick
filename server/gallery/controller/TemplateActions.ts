/**
 * Created by Jacob Xie on 8/29/2020.
 */

import { Request, Response } from "express"
import { getConnection } from "typeorm"

import * as common from "../common"
import * as utils from "../../utils"
import { Template } from "../entity/Template"

const templateRepo = () => getConnection(common.db).getRepository(Template)

const fullRelations = {
  relations: [common.dashboard, common.elements, common.elementsContents]
}
const dashboardAndElementRelations = {
  relations: [common.dashboard, common.elements]
}


export async function getAllTemplates(req: Request, res: Response) {
  const ans = await templateRepo().find(fullRelations)

  res.send(ans)
}

export async function getTemplatesByNames(req: Request, res: Response) {

  if (utils.expressErrorsBreak(req, res)) return

  const ans = await templateRepo().find({
    ...fullRelations,
    ...utils.whereNamesIn(req.query.names as string)
  })

  res.send(ans)
}

export async function saveTemplate(req: Request, res: Response) {

  if (utils.expressErrorsBreak(req, res)) return

  const tr = templateRepo()
  const newTemplate = tr.create(req.body)
  await tr.save(newTemplate)

  res.send(newTemplate)
}

export async function deleteTemplate(req: Request, res: Response) {

  if (utils.expressErrorsBreak(req, res)) return

  const ans = await templateRepo().delete(req.query.id as string)

  res.send(ans)
}

// =====================================================================================================================

export async function getTemplateElementsContents(req: Request, res: Response) {

  if (utils.expressErrorsBreak(req, res)) return

  const dashboardName = req.query.dashboardName as string
  const templateName = req.query.templateName as string

  const ans = await templateRepo().findOne({
    ...fullRelations,
    ...common.whereDashboardNameAndTemplateEqual(dashboardName, templateName)
  })

  res.send(ans)
}

export async function copyTemplateElements(req: Request, res: Response) {

  if (utils.expressErrorsBreak(req, res)) return

  const originDashboardName = req.body.originDashboardName as string
  const originTemplateName = req.body.originTemplateName as string
  const targetDashboardName = req.body.targetDashboardName as string
  const targetTemplateName = req.body.targetTemplateName as string

  const tr = templateRepo()

  const originTemplate = await tr.findOne({
    ...dashboardAndElementRelations,
    ...common.whereDashboardNameAndTemplateEqual(originDashboardName, originTemplateName)
  }) as Template

  const targetTemplate = {
    dashboard: {
      ...originTemplate.dashboard,
      name: targetDashboardName,
    },
    name: targetTemplateName,
    elements: originTemplate.elements,
    description: originTemplate.description
  } as Template

  const newTemplate = tr.create(targetTemplate)
  await tr.save(newTemplate)

  res.send(newTemplate)
}


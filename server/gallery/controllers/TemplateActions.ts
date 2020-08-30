/**
 * Created by Jacob Xie on 8/29/2020.
 */

import { Request, Response } from "express"
import { getRepository } from "typeorm"

import * as common from "../common"
import * as utils from "../../utils"
import { Template } from "../entities/Template"

const templateRepo = () => getRepository(Template)

const dashboardAndElementRelations = {
  relations: [common.dashboard, common.elements, common.elementsContents]
}

export async function getAllTemplates(req: Request, res: Response) {
  const ans = await templateRepo().find(dashboardAndElementRelations)

  res.send(ans)
}

export async function getTemplatesByName(req: Request, res: Response) {

  if (utils.expressErrorsBreak(req, res)) return

  const ans = await templateRepo().find({
    ...dashboardAndElementRelations,
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


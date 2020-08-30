/**
 * Created by Jacob Xie on 8/29/2020.
 */

import { Request, Response } from "express"
import { getRepository } from "typeorm"

import * as common from "../common"
import * as utils from "../../utils"
import { Content } from "../entities/Content"

const contentRepo = () => getRepository(Content)

const elementRelations = {
  relations: [common.element]
}

export async function getAllContents(req: Request, res: Response) {
  const ans = await contentRepo().find(elementRelations)

  res.send(ans)
}

export async function getContentById(req: Request, res: Response) {

  if (utils.expressErrorsBreak(req, res)) return

  const ans = await contentRepo().find({
    ...elementRelations,
    ...utils.whereIdEqual(req.query.id as string)
  })

  res.send(ans)
}

export async function saveContent(req: Request, res: Response) {
  const cr = contentRepo()
  const newContent = cr.create(req.body)
  await cr.save(newContent)

  res.send(newContent)
}

export async function deleteContent(req: Request, res: Response) {

  if (utils.expressErrorsBreak(req, res)) return

  const ans = await contentRepo().delete(req.query.id as string)

  res.send(ans)
}

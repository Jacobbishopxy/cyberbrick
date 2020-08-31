/**
 * Created by Jacob Xie on 8/29/2020.
 */

import { Request, Response } from "express"
import { getConnection } from "typeorm"

import * as common from "../common"
import * as utils from "../../utils"
import { Element } from "../entities/Element"


const elementRepo = () => getConnection(common.db).getRepository(Element)

const templateAndContentRelations = {
  relations: [common.template, common.contents]
}

export async function getAllElements(req: Request, res: Response) {
  const ans = await elementRepo().find(templateAndContentRelations)

  res.send(ans)
}

export async function getElementsByIds(req: Request, res: Response) {

  if (utils.expressErrorsBreak(req, res)) return

  const ans = await elementRepo().find({
    ...templateAndContentRelations,
    ...utils.whereStringIdsIn(req.query.ids as string)
  })

  res.send(ans)
}

export async function saveElement(req: Request, res: Response) {

  if (utils.expressErrorsBreak(req, res)) return

  const er = elementRepo()
  const newElement = er.create(req.body)
  await er.save(newElement)

  res.send(newElement)
}

export async function deleteElement(req: Request, res: Response) {

  if (utils.expressErrorsBreak(req, res)) return

  const ans = await elementRepo().delete(req.query.id as string)

  res.send(ans)
}

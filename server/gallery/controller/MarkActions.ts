/**
 * Created by Jacob Xie on 9/8/2020.
 */


import { Request, Response } from "express"

import * as markService from "../service/MarkService"
import * as utils from "../../utils"
import { Mark } from "../entity/Mark"


export async function getAllMarks(req: Request, res: Response) {
  const ans = await markService.getAllMarks()
  res.send(ans)
}

export async function getMarksByName(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await markService.getMarksByName(req.query.name as string)
  res.send(ans)
}

export async function saveMark(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await markService.saveMark(req.body as Mark)
  res.status(ans).send()
}

export async function deleteMark(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await markService.deleteMark(req.query.id as string)
  res.status(ans).send()
}

// =====================================================================================================================


export async function getCategoriesByMarkName(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await markService.getCategoriesByMarkName(req.query.name as string)
  res.send(ans)
}

export async function deleteMarkInCategory(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const categoryName = req.query.categoryName as string
  const markName = req.query.markName as string
  const ans = await markService.deleteMarkInCategory(categoryName, markName)
  res.status(ans).send()
}

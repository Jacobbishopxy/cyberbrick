/**
 * Created by Jacob Xie on 8/29/2020.
 */

import { Request, Response } from "express"

import * as contentService from "../service/ContentService"
import * as utils from "../../utils"
import { Content } from "../entity/Content"


export async function getAllContents(req: Request, res: Response) {
  const ans = await contentService.getAllContents()

  res.send(ans)
}

export async function getContentById(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await contentService.getContentById(req.query.id as string)

  res.send(ans)
}

export async function saveContent(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await contentService.saveContent(req.body as Content)
  res.status(ans).send()
}

export async function deleteContent(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await contentService.deleteContent(req.query.id as string)

  res.status(ans).send()
}

// =====================================================================================================================



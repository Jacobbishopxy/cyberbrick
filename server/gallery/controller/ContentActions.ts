/**
 * Created by Jacob Xie on 8/29/2020.
 */

import { Request, Response } from "express"

import * as contentService from "../service/ContentService"
import * as utils from "../../utils"
import * as common from "../common"
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
  res.status(ans).end()
}

export async function deleteContent(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await contentService.deleteContent(req.query.id as string)

  res.status(ans).end()
}

// =====================================================================================================================


export async function getContentsInCategoryByElementTypeAndMarkAndTags(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const categoryName = req.query.categoryName as string
  const elementType = req.query.elementType as utils.QueryStr
  const et = elementType ? common.getElementType(elementType) : undefined
  const markName = req.query.markName as utils.QueryStr
  const tagNames = req.query.tagNames as utils.QueryStr
  const tn = tagNames ? tagNames.split(",") : undefined
  const pagination = req.query.pagination as utils.QueryStr
  const pn = utils.paginationExtract(pagination)
  const ans = await contentService
    .getContentsInCategoryByElementTypeAndMarkAndTags(categoryName, et, markName, tn, pn)

  res.send(ans)
}

export async function saveContentInCategory(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await contentService.saveContentInCategory(req.query.name as string, req.body as Content)

  res.status(ans).end()
}

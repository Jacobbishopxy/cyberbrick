/**
 * Created by Jacob Xie on 9/8/2020.
 */


import { Request, Response } from "express"

import * as tagService from "../service/TagService"
import * as utils from "../../utils"
import { Tag } from "../entity/Tag"


export async function getAllTags(req: Request, res: Response) {
  const ans = await tagService.getAllTags()
  res.send(ans)
}

export async function getTagsByName(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await tagService.getTagsByName(req.query.name as string)
  res.send(ans)
}

export async function saveTag(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await tagService.saveTag(req.body as Tag)
  res.status(ans).end()
}

export async function deleteTag(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await tagService.deleteTag(req.query.id as string)
  res.status(ans).end()
}

// =====================================================================================================================


export async function getCategoriesByTagName(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await tagService.getCategoriesByTagName(req.query.name as string)
  res.send(ans)
}

export async function deleteTagInCategory(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const categoryName = req.query.categoryName as string
  const tagName = req.query.tagName as string
  const ans = await tagService.deleteTagInCategory(categoryName, tagName)
  res.status(ans).end()
}

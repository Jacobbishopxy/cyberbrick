/**
 * Created by Jacob Xie on 9/14/2020.
 */

import { Request, Response } from "express"

import * as categoryService from "../service/CategoryService"
import * as utils from "../../utils"
import { Category } from "../entity/Category"
import { Mark } from "../entity/Mark"
import { Tag } from "../entity/Tag"

export async function getAllCategories(req: Request, res: Response) {
  const ans = await categoryService.getAllCategories()
  res.send(ans)
}

export async function getCategoryByName(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await categoryService.getCategoryByName(req.query.name as string)
  res.send(ans)
}

export async function saveCategory(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await categoryService.saveCategory(req.body as Category)
  res.status(ans).end()
}

export async function deleteCategory(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const name = req.query.name as string
  const ans = await categoryService.deleteCategory(name)
  res.status(ans).end()
}

// =====================================================================================================================


export async function getAllCategoriesName(req: Request, res: Response) {
  const ans = await categoryService.getAllCategoriesName()

  res.send(ans)
}

export async function getAllCategoriesWithoutContents(req: Request, res: Response) {
  const ans = await categoryService.getAllCategoriesWithoutContents()

  res.send(ans)
}

export async function getCategoryMarkAndTagByName(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await categoryService.getCategoryMarkAndTagByName(req.query.name as string)
  res.send(ans)
}

export async function getCategoryContentByName(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await categoryService.getCategoryContentByName(req.query.name as string)
  res.send(ans)
}

export async function saveCategoryMark(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await categoryService.saveCategoryMark(req.query.name as string, req.body as Mark)
  res.status(ans).end()
}

export async function saveCategoryTag(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await categoryService.saveCategoryTag(req.query.name as string, req.body as Tag)
  res.status(ans).end()
}


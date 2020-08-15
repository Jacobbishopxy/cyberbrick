/**
 * Created by Jacob Xie on 8/15/2020.
 */

import { Request, Response } from "express"
import { getRepository } from "typeorm"
import { Category } from "../entities/Category"


const catRelations = { relations: ["posts"] }

export async function categoryGetAllAction(req: Request, res: Response) {
  const catRepo = getRepository(Category)
  const cats = await catRepo.find(catRelations)

  res.send(cats)
}

export async function categoryGetByName(req: Request, res: Response) {
  const catRepo = getRepository(Category)
  const cat = await catRepo.findOne(req.params.name, catRelations)

  if (!cat) {
    res.status(404)
    res.send()
    return
  }

  res.send(cat)
}

export async function categorySaveAction(req: Request, res: Response) {
  const catRepo = getRepository(Category)
  const newCat = catRepo.create(req.body)
  await catRepo.save(newCat)

  res.send(newCat)
}

export async function categoryDeleteAction(req: Request, res: Response) {
  const catRepo = getRepository(Category)
  const cat = await catRepo.delete(req.params.name)

  res.send(cat)
}

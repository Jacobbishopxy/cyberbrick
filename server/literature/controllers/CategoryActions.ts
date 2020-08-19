/**
 * Created by Jacob Xie on 8/19/2020.
 */

import { Request, Response } from "express"
import { getRepository } from "typeorm"
import { QueryStr, category } from "../common"
import { Category } from "../entities/Category"


const repo = () => getRepository(Category)

export async function getAllCategories(req: Request, res: Response) {
  const categories = await repo().find()

  res.send(categories)
}

export async function getCategoriesByNames(req: Request, res: Response) {
  const names = req.query.names as QueryStr
  if (names === undefined) {
    res.status(400)
    res.send("names is required, `?names=N1,N2,N3`")
    return
  }

  const namesArr = names.split(",")
  const cats = await repo()
    .createQueryBuilder()
    .where(`${ category }.name IN (:...names)`, { names: namesArr })
    .getMany()

  res.send(cats)
}

export async function saveCategory(req: Request, res: Response) {
  const rp = repo()
  const newCat = rp.create(req.body)
  await rp.save(newCat)

  res.send(newCat)
}

export async function deleteCategory(req: Request, res: Response) {
  const name = req.query.name as QueryStr
  if (name === undefined) {
    res.status(400)
    res.send("name is required")
    return
  }

  await repo()
    .createQueryBuilder()
    .delete()
    .where("name = :name", { name })
    .execute()

  res.send(name)
}

/**
 * Created by Jacob Xie on 8/15/2020.
 */

import { Request, Response } from "express"
import { getRepository } from "typeorm"
import { Target } from "../entities/Target"

const targetRelations = { relations: ["tags"] }

export async function targetGetAllAction(req: Request, res: Response) {
  const targetRepo = getRepository(Target)
  const targets = await targetRepo.find(targetRelations)

  res.send(targets)
}

export async function targetGetByIdAction(req: Request, res: Response) {
  const targetRepo = getRepository(Target)
  const target = await targetRepo.findOne(req.query.id as string, targetRelations)

  if (!target) {
    res.status(404)
    res.send()
    return
  }
  res.send(target)
}

export async function targetSaveAction(req: Request, res: Response) {
  const targetRepo = getRepository(Target)
  const newTarget = targetRepo.create(req.body)
  await targetRepo.save(newTarget)

  res.send(newTarget)
}

export async function targetDeleteAction(req: Request, res: Response) {
  const targetRepo = getRepository(Target)
  const target = await targetRepo.delete(req.query.id as string)

  res.send(target)
}

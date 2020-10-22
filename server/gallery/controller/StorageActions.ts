/**
 * Created by Jacob Xie on 10/22/2020.
 */

import { Request, Response } from "express"

import * as storageService from "../service/StorageService"
import * as utils from "../../utils"
import { Storage } from "../entity/Storage"

export async function getAllStorages(req: Request, res: Response) {
  const ans = await storageService.getAllStorages()

  res.send(ans)
}

export async function getStorageByName(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const id = req.query.id as string
  const ans = await storageService.getStorageById(id)

  res.send(ans)
}

export async function saveStorage(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const ans = await storageService.saveStorage(req.body as Storage)

  res.status(ans).end()
}

export async function deleteStorage(req: Request, res: Response) {
  if (utils.expressErrorsBreak(req, res)) return

  const id = req.query.id as string
  const ans = await storageService.deleteStorage(id)

  res.sendStatus(ans)
}

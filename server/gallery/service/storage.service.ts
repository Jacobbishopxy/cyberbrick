/**
 * Created by Jacob Xie on 10/22/2020.
 */

import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { getConnection, Repository } from "typeorm"

import * as common from "../common"
import * as utils from "../../utils"
import { Storage } from "../entity/Storage"

const storageRepo = () => getConnection(common.db).getRepository(Storage)

export async function getAllStorages() {
  return storageRepo().find()
}

export async function getStorageById(id: string) {
  return storageRepo().findOne({
    ...utils.whereIdEqual(id)
  })
}

export async function saveStorage(storage: Storage) {
  const sr = storageRepo()
  const newStorage = sr.create(storage)
  await sr.save(newStorage)

  return utils.HTMLStatus.SUCCESS_MODIFY
}

export async function deleteStorage(id: string) {
  const sr = storageRepo()
  const s = await getStorageById(id)
  if (s) {
    await sr.remove(s, { listeners: true })
    return utils.HTMLStatus.SUCCESS_DELETE
  }

  return utils.HTMLStatus.FAIL_OPERATION
}

// =====================================================================================================================

// todo: new function: test db connection

export async function executeSql(id: string, sqlString: string) {
  const repo = getConnection(id)
  return repo.query(sqlString)
}

@Injectable()
export class StorageService {
  constructor(@InjectRepository(Storage) private repo: Repository<Storage>) {}

  getAllStorages() {
    return this.repo.find()
  }

  getStorageById(id: string) {
    return this.repo.findOne({
      ...utils.whereIdEqual(id)
    })
  }

  saveStorage(storage: Storage) {
    const newSto = this.repo.create(storage)
    return this.repo.save(newSto)
  }

  async deleteStorage(id: string) {
    const i = await this.getStorageById(id)
    if (i) {
      this.repo.remove(i, {listeners: true})
      return true
    }
    return false
  }

  // ===================================================================================================================

  executeSql = (id: string, sqlString: string) => {
    const repo = getConnection(id)
    return repo.query(sqlString)
  }
}


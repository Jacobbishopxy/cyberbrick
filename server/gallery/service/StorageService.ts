/**
 * Created by Jacob Xie on 10/22/2020.
 */

import { getConnection } from "typeorm"

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


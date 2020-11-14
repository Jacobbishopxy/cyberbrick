/**
 * Created by Jacob Xie on 10/22/2020.
 */

import {Injectable} from "@nestjs/common"
import {InjectRepository} from "@nestjs/typeorm"
import {createConnection, getConnection, Repository} from "typeorm"
import _ from "lodash"

import * as common from "../common"
import * as utils from "../../utils"
import {Storage} from "../entity"


@Injectable()
export class StorageService {
  constructor(@InjectRepository(Storage, common.db) private repo: Repository<Storage>) {}

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

  testConnection = (id: string) => {
    const repo = getConnection(id)
    return repo.isConnected
  }

  reloadConnection = async (id: string) => {
    if (!this.testConnection(id)) {
      await createConnection(id)
      if (this.testConnection(id))
        return "Successfully reconnect!"
      else
        return "Failed reconnect!"
    } else {
      return "Already connected!"
    }
  }

  executeSql = (id: string, sqlString: string) => {
    const repo = getConnection(id)
    return repo.query(sqlString)
  }

  read = (id: string, selects: string[], tableName: string, conditions?: Condition[]) => {
    const query = genReadStr(selects, tableName, conditions)
    return this.executeSql(id, query)
  }
}

export enum ConditionSymbol {
  Equal = "=",
  Greater = ">",
  GreaterEqual = ">=",
  Lesser = "<",
  LesserEqual = "<="
}

export interface Condition {
  field: string
  value: string
  symbol: ConditionSymbol
}

const genConditionStr = (c: Condition) =>
  `"${c.field}" ${c.symbol} '${c.value}'`

const genReadStr = (selects: string[], tableName: string, conditions?: Condition[]) => {
  let s = `SELECT ${selects.join(",")} FROM "${tableName}"`
  if (conditions) {
    s += _.reduce(conditions, (ans: string, item: Condition) => {
      return `${ans} ${genConditionStr(item)} AND`
    }, " WHERE ")
    s = s.slice(0, -4)
  }
  return s
}

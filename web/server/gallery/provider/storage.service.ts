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
import {ReadDto, ConditionDto} from "./read.dto"


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

  read = (id: string, readDto: ReadDto) => {
    const query = genReadStr(readDto.selects, readDto.tableName, readDto.conditions)
    return this.executeSql(id, query)
  }
}

const genConditionStr = (c: ConditionDto) =>
  `"${c.field}" ${c.symbol} '${c.value}'`

const genReadStr = (selects: string[] | undefined,
                    tableName: string,
                    conditions?: ConditionDto[]) => {
  const selection = selects ? selects.map(i => `"${i}"`).join(", ") : "*"
  let s = `SELECT ${selection} FROM "${tableName}"`

  if (conditions) {
    s += _.reduce(conditions, (ans: string, item: ConditionDto) => {
      return `${ans} ${genConditionStr(item)} AND`
    }, " WHERE ")
    s = s.slice(0, -4)
  }
  return s
}


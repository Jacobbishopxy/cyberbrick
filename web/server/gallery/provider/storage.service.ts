/**
 * Created by Jacob Xie on 10/22/2020.
 */

import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { createConnection, getConnection, Repository } from "typeorm"
import _ from "lodash"

import * as common from "../common"
import * as utils from "../../utils"
import { Storage } from "../entity"
import { ReadDto, ConditionDto, OrderDto } from "../dto"
import { MongoReadDto, PostgresReadDto } from "../dto/read.dto"
import * as MongoService from "./contentMongo.service"

@Injectable()
export class StorageService {
  constructor(@InjectRepository(Storage, common.db) private repo: Repository<Storage>,
    private readonly mongoService: MongoService.MongoService
  ) { }

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
      await this.repo.remove(i, { listeners: true })
      return true
    }
    return false
  }

  // ===================================================================================================================

  getAllStorageSimple = () => {
    return this.repo.find({ select: [common.id, common.name, common.description] })
  }

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

  readFromDB = (id: string, readDto: ReadDto, databaseType: string) => {
    const storageType = common.getStorageType(databaseType)
    switch (storageType) {
      case common.StorageType.PG:
        return this.readFromPostgres(id, readDto as PostgresReadDto)

      case common.StorageType.MONGO:
        const mongoReadDto = readDto as MongoReadDto
        return this.mongoService.getContentData(mongoReadDto.collection, id)
    }
    //if storage type is not pg or mongo, return error
    throw new HttpException("Mismatch storage type! Currently only support pg or mongo", HttpStatus.INTERNAL_SERVER_ERROR)
  }

  readFromPostgres = (id: string, readDto: PostgresReadDto) => {
    const query = genReadStr(
      readDto.selects,
      readDto.tableName,
      readDto.conditions,
      readDto.ordering
    )
    return this.executeSql(id, query)
  }
}

const genConditionStr = (c: ConditionDto) => {
  const rr = `"${c.field}" ${c.symbol} '${c.value}'`
  if (c.junction)
    return `${rr} ${c.junction}`
  return rr
}

const genOrderingStr = (o: OrderDto) =>
  `${o.field} ${o.direction} ,`

const genReadStr = (
  selects: string[] | undefined,
  tableName: string,
  conditions?: ConditionDto[],
  ordering?: OrderDto[]
) => {
  const selection = selects ? selects.map(i => `"${i}"`).join(", ") : "*"
  let s = `SELECT ${selection} FROM "${tableName}"`

  if (conditions && conditions.length !== 0) {
    s += _.reduce(conditions, (ans: string, item: ConditionDto) => {
      return `${ans} ${genConditionStr(item)}`
    }, " WHERE ")
  }
  if (ordering && ordering.length !== 0) {
    s += _.reduce(ordering, (ans: string, item: OrderDto) => {
      return `${ans} ${genOrderingStr(item)}`
    }, " ORDER BY ")
    s = s.slice(0, -1)
  }
  return s
}


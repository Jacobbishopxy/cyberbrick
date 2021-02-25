/**
 * Created by Jacob Xie on 2/3/2021
 */

import {Injectable} from "@nestjs/common"
import {InjectRepository} from "@nestjs/typeorm"
import {Repository} from "typeorm"

import * as common from "../common"
import * as utils from "../../utils"
import {Update} from "../entity"


const updateRelations = {
  relations: ["tags"]
}

@Injectable()
export class UpdateService {
  constructor(@InjectRepository(Update, common.db) private repo: Repository<Update>) {}

  getAllUpdate() {
    return this.repo.find(updateRelations)
  }

  getUpdateById(id: string) {
    return this.repo.findOne({
      ...updateRelations,
      ...utils.whereIdEqual(id)
    })
  }

  saveUpdate(update: Update) {
    const newUpd = this.repo.create(update)
    return this.repo.save(newUpd)
  }

  deleteUpdate(id: string) {
    return this.repo.delete(id)
  }

  getLatestUpdate(pagination?: [number, number]) {
    return this.repo.find({
      ...updateRelations,
      ...utils.orderByDate("DESC"),
      ...utils.paginationGet(pagination)
    })
  }

  getUpdateCount() {
    return this.repo.count()
  }
}


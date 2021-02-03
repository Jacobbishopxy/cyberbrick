/**
 * Created by Jacob Xie on 2/3/2021
 */

import {Injectable} from "@nestjs/common"
import {InjectRepository} from "@nestjs/typeorm"
import {Repository} from "typeorm"

import * as common from "../common"
import * as utils from "../../utils"
import {Update} from "../entity"


@Injectable()
export class UpdateService {
  constructor(@InjectRepository(Update, common.db) private repo: Repository<Update>) {}

  getAllUpdate() {
    return this.repo.find()
  }

  getUpdateById(id: string) {
    return this.repo.findOne({
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
      ...utils.orderByDate("DESC"),
      ...utils.paginationGet(pagination)
    })
  }
}


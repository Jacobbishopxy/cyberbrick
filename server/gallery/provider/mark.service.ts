/**
 * Created by Jacob Xie on 9/14/2020.
 */

import {Injectable} from "@nestjs/common"
import {InjectRepository} from "@nestjs/typeorm"
import {Repository} from "typeorm"

import * as common from "../common"
import * as utils from "../../utils"
import {Mark} from "../entity"


const markFullRelations = {
  relations: [
    common.category,
    common.contents
  ]
}

const markCategoryRelations = {
  relations: [common.category]
}

@Injectable()
export class MarkService {
  constructor(@InjectRepository(Mark, common.db) private repo: Repository<Mark>) {}

  getAllMarks() {
    return this.repo.find(markFullRelations)
  }

  getMarksByName(name: string) {
    return this.repo.find({
      ...markFullRelations,
      ...utils.whereNameEqual(name)
    })
  }

  saveMark(mark: Mark) {
    const newMrk = this.repo.create(mark)
    return this.repo.save(newMrk)
  }

  deleteMark(id: string) {
    return this.repo.delete(id)
  }

  // ===================================================================================================================

  async getCategoriesByMarkName(name: string) {
    const raw = await this.repo.find({
      ...markCategoryRelations,
      ...utils.whereNameEqual(name),
      select: [common.id]
    })

    if (raw) return raw.map(i => i.category)
    return []
  }

  deleteMarkInCategory(categoryName: string, markName: string) {
    return this.repo
      .createQueryBuilder(common.mark)
      .leftJoinAndSelect(common.markCategory, common.category)
      .select([common.markName, common.categoryName])
      .where(
        `${common.categoryName} = :categoryName AND ${common.markName} = :markName`,
        {categoryName, markName}
      )
      .delete()
      .execute()
  }
}


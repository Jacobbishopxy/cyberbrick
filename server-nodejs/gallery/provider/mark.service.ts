/**
 * Created by Jacob Xie on 9/14/2020.
 */

import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import _ from "lodash"

import * as common from "../common"
import * as utils from "../../utils"
import { Mark, Category } from "../entity"


const categoryMarkRelations = {
  relations: [common.marks]
}

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
  constructor(@InjectRepository(Mark, common.db) private repo: Repository<Mark>,
    @InjectRepository(Category, common.db) private repoCategory: Repository<Category>) { }

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

  async modifyMark(mark: Mark) {
    if (mark.id) {
      const mk = await this.repo.findOne({ ...utils.whereIdEqual(mark.id) })

      if (mk) {
        const newMark = this.repo.create({
          ...mk,
          ...mark
        })
        await this.repo.save(newMark)
        return true
      }
    }
    return false
  }

  deleteMarkInCategory(categoryName: string, markName: string) {
    return this.repo
      .createQueryBuilder(common.mark)
      .leftJoinAndSelect(common.markCategory, common.category)
      .select([common.markName, common.categoryName])
      .where(`${common.categoryName} = :categoryName AND ${common.markName} = :markName`, {
        categoryName,
        markName
      })
      .delete()
      .execute()
  }

  saveMarks(marks: Mark[]) {
    const newMarks = marks.map(m => this.repo.create(m))
    return this.repo.save(newMarks)
  }

  deleteMarks(markIds: string[]) {
    return this.repo.delete(markIds)
  }

  async updateMarksInCategory(categoryName: string, marks: Mark[]) {
    const cat = await this.repoCategory.findOne({
      ...categoryMarkRelations,
      ...utils.whereNameEqual(categoryName)
    })
    if (cat) {
      const marksRemove = _.differenceWith(
        cat.marks, marks, (prev, curr) => prev.id === curr.id
      )

      if (marksRemove.length > 0)
        await this.deleteMarks(marksRemove.map(m => m.id))

      //relate marks with category, otherwise Error: "null value in column "categoryName" violates not-null constraint" 
      marks = marks.map(mk => { return { ...mk, category: cat } })
      await this.saveMarks(marks)

      return true
    }

    return false
  }
}


/**
 * Created by Jacob Xie on 9/16/2020.
 */

import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import * as common from "../common"
import * as utils from "../../utils"
import { Dashboard, Category } from "../entity"


const dashboardFullRelations = {
  relations: [
    common.category,
    common.templates,
    common.templatesElements,
    common.templatesElementsContents
  ]
}

const dashboardTemplateRelations = {
  relations: [common.templates]
}

const dashboardAndCategoryMarkAndTemplateRelations = {
  relations: [
    common.category,
    common.categoryMarks,
    common.templates
  ]
}

const categoryDashboardRelations = {
  relations: [common.dashboard]
}

@Injectable()
export class DashboardService {
  constructor(@InjectRepository(Dashboard, common.db) private repoDashboard: Repository<Dashboard>,
              @InjectRepository(Category, common.db) private repoCategory: Repository<Category>) {}

  getAllDashboards() {
    return this.repoDashboard.find(dashboardFullRelations)
  }

  getDashboardByName(name: string) {
    return this.repoDashboard.findOne({
      ...dashboardFullRelations,
      ...utils.whereNameEqual(name)
    })
  }

  saveDashboard(dashboard: Dashboard) {
    const newDsb = this.repoDashboard.create(dashboard)
    return this.repoDashboard.save(newDsb)
  }

  deleteDashboard(name: string) {
    return this.repoDashboard.delete(name)
  }

  // ===================================================================================================================

  getAllDashboardsName() {
    return this.repoDashboard.find({ select: [common.name] })
  }

  getDashboardCategoryMarksAndTemplateByName(dashboardName: string) {
    return this.repoDashboard.findOne({
      ...dashboardAndCategoryMarkAndTemplateRelations,
      ...utils.whereNameEqual(dashboardName)
    })
  }

  getAllDashboardsTemplate() {
    return this.repoDashboard.find(dashboardTemplateRelations)
  }

  async modifyDashboardDescription(dashboardName: string, description: string) {
    const dsb = await this.repoDashboard.findOne({
      ...utils.whereNameEqual(dashboardName)
    })

    if (dsb) {
      const newDsb = this.repoDashboard.create({
        name: dsb.name,
        description
      })
      await this.repoDashboard.save(newDsb)
      return true
    }

    return false
  }

  async newDashboardAttachToEmptyCategory(categoryName: string, dashboard: Dashboard) {
    const cat = await this.repoCategory.findOne({
      ...categoryDashboardRelations,
      ...utils.whereNameEqual(categoryName)
    })

    if (cat && cat.dashboard === null) {
      const newDb = this.repoDashboard.create({
        ...dashboard,
        category: {
          name: categoryName
        },
      })
      await this.repoDashboard.save(newDb)

      return true
    }

    return false
  }
}

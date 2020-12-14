/**
 * Created by Jacob Xie on 9/16/2020.
 */

import {Injectable} from "@nestjs/common"
import {InjectRepository} from "@nestjs/typeorm"
import {Repository} from "typeorm"

import * as common from "../common"
import * as utils from "../../utils"
import {Dashboard, Category} from "../entity"


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

  getDashboardById(id: string) {
    return this.repoDashboard.findOne({
      ...dashboardFullRelations,
      ...utils.whereIdEqual(id)
    })
  }

  saveDashboard(dashboard: Dashboard) {
    const newDsb = this.repoDashboard.create(dashboard)
    return this.repoDashboard.save(newDsb)
  }

  deleteDashboard(id: string) {
    return this.repoDashboard.delete(id)
  }

  // ===================================================================================================================

  getAllDashboardsName() {
    return this.repoDashboard.find({select: [common.name]})
  }

  getAllDashboardsTemplate() {
    return this.repoDashboard.find(dashboardTemplateRelations)
  }

  getDashboardCategoryMarksAndTemplate(dashboardId: string) {
    return this.repoDashboard.findOne({
      ...dashboardAndCategoryMarkAndTemplateRelations,
      ...utils.whereIdEqual(dashboardId)
    })
  }

  async modifyDashboard(dashboard: Dashboard) {
    const dsb = await this.repoDashboard.findOne({
      ...utils.whereIdEqual(dashboard.id)
    })

    if (dsb) {
      const newDsb = this.repoDashboard.create({
        ...dsb,
        name: dashboard.name,
        description: dashboard.description
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

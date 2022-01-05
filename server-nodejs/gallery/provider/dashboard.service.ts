/**
 * Created by Jacob Xie on 9/16/2020.
 */

import {Injectable} from "@nestjs/common"
import {InjectRepository} from "@nestjs/typeorm"
import {Repository} from "typeorm"
import _ from "lodash"

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
  relations: [
    common.category,
    common.templates
  ]
}

const dashboardCategoryRelations = {
  relations: [
    common.category
  ]
}

const categoryDashboardRelations = {
  relations: [common.dashboards]
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

  getAllDashboardsTemplate() {
    return this.repoDashboard.find(dashboardTemplateRelations)
  }

  getDashboardCategoryAndTemplate(dashboardId: string) {
    return this.repoDashboard.findOne({
      ...dashboardTemplateRelations,
      ...utils.whereIdEqual(dashboardId)
    })
  }

  async modifyDashboard(dashboard: Dashboard) {
    if (dashboard.id) {
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
    }

    return false
  }

  async newDashboardAttachToCategory(categoryName: string, dashboard: Dashboard) {
    const cat = await this.repoCategory.findOne({
      ...categoryDashboardRelations,
      ...utils.whereNameEqual(categoryName)
    })

    if (cat) {
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

  deleteDashboardInCategory(categoryName: string, dashboardName: string) {
    return this.repoDashboard
      .createQueryBuilder(common.dashboard)
      .leftJoinAndSelect(common.dashboardCategory, common.dashboard)
      .select([common.dashboardName, common.categoryName])
      .where(`${common.categoryName} = :categoryName AND ${common.dashboardName} = :dashboardName`, {
        categoryName,
        dashboardName
      })
      .delete()
      .execute()
  }

  saveDashboards(dashboards: Dashboard[]) {
    const newDashboards = dashboards.map(d => this.repoDashboard.create(d))
    return this.repoDashboard.save(newDashboards)
  }

  deleteDashboards(dashboardIds: string[]) {
    return this.repoDashboard.delete(dashboardIds)
  }

  async updateDashboardsInCategory(categoryName: string, dashboards: Dashboard[]) {
    const cat = await this.repoCategory.findOne({
      ...categoryDashboardRelations,
      ...utils.whereNameEqual(categoryName)
    })

    if (cat) {
      const dashboardsRemove = _.differenceWith(
        cat.dashboards, dashboards, (prev, curr) => prev.id === curr.id
      )

      if (dashboardsRemove.length > 0)
        await this.deleteDashboards(dashboardsRemove.map(d => d.id))

      const newDashboards = dashboards.map(d => ({...d, category: {name: categoryName}})) as Dashboard[]
      await this.saveDashboards(newDashboards)

      return true
    }

    return false
  }

  async searchDashboards(keyword: string) {
    return this.repoDashboard.find({
      ...dashboardCategoryRelations,
      ...utils.whereNameLike(keyword)
    })
  }
}


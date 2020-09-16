/**
 * Created by Jacob Xie on 9/16/2020.
 */

import { getConnection } from "typeorm"

import * as common from "../common"
import * as utils from "../../utils"
import { Dashboard } from "../entity/Dashboard"
import { Category } from "../entity/Category"


const dashboardRepo = () => getConnection(common.db).getRepository(Dashboard)
const categoryRepo = () => getConnection(common.db).getRepository(Category)

const dashboardFullRelations = {
  relations: [
    common.category,
    common.templates,
    common.templatesElements,
    common.templatesElementsContents
  ]
}

const categoryDashboardRelations = {
  relations: [common.dashboard]
}

const templateAndElementRelations = {
  relations: [
    common.templates,
    common.templatesElements
  ]
}

export async function getAllDashboards() {
  return dashboardRepo().find(dashboardFullRelations)
}

export async function getDashboardByName(name: string) {
  return dashboardRepo().findOne({
    ...dashboardFullRelations,
    ...utils.whereNameEqual(name)
  })
}

export async function saveDashboard(dashboard: Dashboard) {
  const dr = dashboardRepo()
  const newDb = dr.create(dashboard)
  await dr.save(newDb)

  return utils.HTMLStatus.SUCCESS_MODIFY
}

export async function deleteDashboard(name: string) {
  await dashboardRepo().delete(name)
  return utils.HTMLStatus.SUCCESS_DELETE
}

// =====================================================================================================================

/**
 * for copy & pasting existing template layout
 */
export async function getDashboardTemplateElementsByName(dashboardName: string, templateName: string) {
  return dashboardRepo().findOne({
    ...templateAndElementRelations,
    ...common.whereDashboardAndTemplateNameEqual(dashboardName, templateName)
  })
}

export async function newDashboardAttachToEmptyCategory(categoryName: string, dashboard: Dashboard) {
  const cat = await categoryRepo().findOne({
    ...categoryDashboardRelations,
    ...utils.whereNameEqual(categoryName)
  })

  if (cat && cat.dashboard === null) {
    const dr = dashboardRepo()
    const newDb = dr.create(dashboard)
    await dr.save(newDb)

    return utils.HTMLStatus.SUCCESS_MODIFY
  }

  return utils.HTMLStatus.FAIL_REQUEST
}

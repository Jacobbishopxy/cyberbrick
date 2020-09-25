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

export async function getAllDashboardsName() {
  return dashboardRepo().find({ select: [common.name] })
}

export async function getDashboardCategoryMarksAndTemplateByName(dashboardName: string) {
  return dashboardRepo().findOne({
    ...dashboardAndCategoryMarkAndTemplateRelations,
    ...utils.whereNameEqual(dashboardName)
  })
}

export async function modifyDashboardDescription(dashboardName: string, description: string) {
  const dr = dashboardRepo()
  const dsb = await dr.findOne({
    ...utils.whereNameEqual(dashboardName)
  })

  if (dsb) {
    const newDsb = dr.create({
      name: dsb.name,
      description
    })
    await dr.save(newDsb)
    return utils.HTMLStatus.SUCCESS_MODIFY
  }

  return utils.HTMLStatus.FAIL_REQUEST
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

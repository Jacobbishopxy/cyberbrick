/**
 * Created by Jacob Xie on 8/30/2020.
 */

import * as contentActions from "./controller/ContentActions"
import * as dashboardActions from "./controller/DashboardActions"
import * as elementActions from "./controller/ElementActions"
import * as templateActions from "./controller/TemplateActions"
import * as common from "./common"
import * as utils from "../utils"

const base = "/api/gallery"

const contentRoutes: utils.OrmRoute[] = [
  {
    path: `${ base }/contents`,
    method: "get",
    action: contentActions.getAllContents
  },
  {
    path: `${ base }/content`,
    method: "get",
    check: [common.queryIdCheck],
    action: contentActions.getContentById
  },
  {
    path: `${ base }/content`,
    method: "post",
    action: contentActions.saveContent
  },
  {
    path: `${ base }/content`,
    method: "delete",
    check: [common.queryIdCheck],
    action: contentActions.deleteContent
  },
]

const dashboardRoutes: utils.OrmRoute[] = [
  {
    path: `${ base }/dashboards`,
    method: "get",
    action: dashboardActions.getAllDashboards
  },
  {
    path: `${ base }/dashboard`,
    method: "get",
    check: [common.queryNameCheck],
    action: dashboardActions.getDashboardByName
  },
  {
    path: `${ base }/dashboard`,
    method: "post",
    action: dashboardActions.saveDashboard
  },
  {
    path: `${ base }/dashboard`,
    method: "delete",
    check: [common.queryNameCheck],
    action: dashboardActions.deleteDashboard
  },
  {
    path: `${ base }/getDashboardTemplateElementsByName`,
    method: "get",
    check: [
      common.queryDashboardNameCheck,
      common.queryTemplateNameCheck
    ],
    action: dashboardActions.getDashboardTemplateElementsByName
  },
]

const elementRoutes: utils.OrmRoute[] = [
  {
    path: `${ base }/elements`,
    method: "get",
    action: elementActions.getAllElements
  },
  {
    path: `${ base }/element`,
    method: "get",
    check: [common.queryIdsCheck],
    action: elementActions.getElementsByIds
  },
  {
    path: `${ base }/element`,
    method: "post",
    action: elementActions.saveElement
  },
  {
    path: `${ base }/element`,
    method: "delete",
    check: [common.queryIdCheck],
    action: elementActions.deleteElement
  },
]

const templateRoutes: utils.OrmRoute[] = [
  {
    path: `${ base }/templates`,
    method: "get",
    action: templateActions.getAllTemplates
  },
  {
    path: `${ base }/template`,
    method: "get",
    check: [common.queryNamesCheck],
    action: templateActions.getTemplatesByNames
  },
  {
    path: `${ base }/template`,
    method: "post",
    action: templateActions.saveTemplate
  },
  {
    path: `${ base }/template`,
    method: "delete",
    check: [common.queryIdCheck],
    action: templateActions.deleteTemplate
  },
  {
    path: `${ base }/getTemplateElementsContents`,
    method: "get",
    check: [
      common.queryDashboardNameCheck,
      common.queryTemplateNameCheck
    ],
    action: templateActions.getTemplateElementsContents
  },
  {
    path: `${ base }/copyTemplateElements`,
    method: "post",
    action: templateActions.copyTemplateElements
  },
]

export const gallery: utils.OrmRoute[] = [

  ...contentRoutes,

  ...dashboardRoutes,

  ...elementRoutes,

  ...templateRoutes

]

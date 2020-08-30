/**
 * Created by Jacob Xie on 8/30/2020.
 */

import * as contentActions from "./controllers/ContentActions"
import * as dashboardActions from "./controllers/DashboardActions"
import * as elementActions from "./controllers/ElementActions"
import * as templateActions from "./controllers/TemplateActions"
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

]

const dashboardRoutes: utils.OrmRoute[] = [
  {
    path: `${base}/dashboards`,
    method: "get",
    action: dashboardActions.getAllDashboards
  },

]

const elementRoutes: utils.OrmRoute[] = [
  {
    path: `${base}/elements`,
    method: "get",
    action: elementActions.getAllElements
  },

]

const templateRoutes: utils.OrmRoute[] = [
  {
    path: `${base}/templates`,
    method: "get",
    action: templateActions.getAllTemplates
  },

]

export const gallery: utils.OrmRoute[] = [

  ...contentRoutes,

  ...dashboardRoutes,

  ...elementRoutes,

  ...templateRoutes

]

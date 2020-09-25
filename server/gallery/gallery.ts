/**
 * Created by Jacob Xie on 8/30/2020.
 */

import * as categoryActions from "./controller/CategoryActions"
import * as markActions from "./controller/MarkActions"
import * as tagActions from "./controller/TagActions"
import * as contentActions from "./controller/ContentActions"
import * as dashboardActions from "./controller/DashboardActions"
import * as elementActions from "./controller/ElementActions"
import * as templateActions from "./controller/TemplateActions"
import * as common from "./common"
import * as utils from "../utils"

const base = "/api/gallery"

const categoryRoutes: utils.OrmRoute[] = [
  {
    path: `${ base }/categories`,
    method: "get",
    action: categoryActions.getAllCategories
  },
  {
    path: `${ base }/category`,
    method: "get",
    check: [common.queryNameCheck],
    action: categoryActions.getCategoryByName
  },
  {
    path: `${ base }/category`,
    method: "post",
    check: [common.bodyNameCheck],
    action: categoryActions.saveCategory
  },
  {
    path: `${ base }/category`,
    method: "delete",
    check: [common.queryNameCheck],
    action: categoryActions.deleteCategory
  },
  {
    path: `${ base }/getAllCategoriesName`,
    method: "get",
    action: categoryActions.getAllCategoriesName
  },
  {
    path: `${ base }/getAllCategoriesWithoutContents`,
    method: "get",
    action: categoryActions.getAllCategoriesWithoutContents
  },
  {
    path: `${ base }/getCategoryMarkAndTagByName`,
    method: "get",
    check: [common.queryNameCheck],
    action: categoryActions.getCategoryMarkAndTagByName
  },
  {
    path: `${ base }/getCategoryContentByName`,
    method: "get",
    check: [common.queryNameCheck],
    action: categoryActions.getCategoryContentByName
  },
  {
    path: `${ base }/modifyCategoryDescription`,
    method: "post",
    check: [
      common.bodyNameCheck,
      common.bodyDescriptionCheck
    ],
    action: categoryActions.modifyCategoryDescription
  },
  {
    path: `${ base }/saveCategoryMark`,
    method: "post",
    check: [
      common.queryNameCheck,
      common.bodyNameCheck
    ],
    action: categoryActions.saveCategoryMark
  },
  {
    path: `${ base }/saveCategoryTag`,
    method: "post",
    check: [
      common.queryNameCheck,
      common.bodyNameCheck
    ],
    action: categoryActions.saveCategoryTag
  },
]

const markRoutes: utils.OrmRoute[] = [
  {
    path: `${ base }/marks`,
    method: "get",
    action: markActions.getAllMarks
  },
  {
    path: `${ base }/mark`,
    method: "get",
    check: [common.queryNameCheck],
    action: markActions.getMarksByName
  },
  {
    path: `${ base }/mark`,
    method: "post",
    check: [common.bodyNameCheck],
    action: markActions.saveMark
  },
  {
    path: `${ base }/mark`,
    method: "delete",
    check: [common.queryIdCheck],
    action: markActions.deleteMark
  },
  {
    path: `${ base }/getCategoriesByMarkName`,
    method: "get",
    check: [common.queryNameCheck],
    action: markActions.getCategoriesByMarkName
  },
  {
    path: `${ base }/deleteMarkInCategory`,
    method: "delete",
    check: [
      common.queryCategoryNameCheck,
      common.queryMarkNameCheck,
    ],
    action: markActions.deleteMarkInCategory
  },
]

const tagRoutes: utils.OrmRoute[] = [
  {
    path: `${ base }/tags`,
    method: "get",
    action: tagActions.getAllTags
  },
  {
    path: `${ base }/tag`,
    method: "get",
    check: [common.queryNameCheck],
    action: tagActions.getTagsByName
  },
  {
    path: `${ base }/tag`,
    method: "post",
    check: [common.bodyNameCheck],
    action: tagActions.saveTag
  },
  {
    path: `${ base }/tag`,
    method: "delete",
    check: [common.queryIdCheck],
    action: tagActions.deleteTag
  },
  {
    path: `${ base }/getCategoriesByTagName`,
    method: "get",
    check: [common.queryNameCheck],
    action: tagActions.getCategoriesByTagName
  },
  {
    path: `${ base }/deleteTagInCategory`,
    method: "delete",
    check: [
      common.queryCategoryNameCheck,
      common.queryTagNameCheck,
    ],
    action: tagActions.deleteTagInCategory
  },
]

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
  {
    path: `${ base }/getContentsInCategoryByElementTypeAndMarkAndTags`,
    method: "get",
    check: [
      common.queryCategoryNameCheck,
      common.queryOptionalElementTypeCheck,
      common.queryOptionalMarkNameCheck,
      common.queryOptionalTagNamesCheck,
      common.queryOptionalPaginationCheck
    ],
    action: contentActions.getContentsInCategoryByElementTypeAndMarkAndTags
  },
  {
    path: `${ base }/saveContentInCategory`,
    method: "post",
    check: [
      common.bodyCategoryCheck,
      common.bodyDateCheck,
      common.bodyTitleCheck,
      common.bodyDataCheck
    ],
    action: contentActions.saveContentInCategory
  }
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
    path: `${ base }/getAllDashboardsName`,
    method: "get",
    action: dashboardActions.getAllDashboardsName
  },
  {
    path: `${ base }/getDashboardCategoryMarksAndTemplateByName`,
    method: "get",
    check: [common.queryNameCheck],
    action: dashboardActions.getDashboardCategoryMarksAndTemplateByName
  },
  {
    path: `${ base }/modifyDashboardDescription`,
    method: "post",
    check: [
      common.bodyNameCheck,
      common.bodyDescriptionCheck
    ],
    action: dashboardActions.modifyDashboardDescription
  },
  {
    path: `${ base }/newDashboardAttachToEmptyCategory`,
    method: "post",
    check: [
      common.queryCategoryNameCheck,
      common.bodyCategoryCheck
    ],
    action: dashboardActions.newDashboardAttachToEmptyCategory
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
    check: [common.queryIdCheck],
    action: templateActions.getTemplateById
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
    path: `${ base }/getTemplateElements`,
    method: "get",
    check: [
      common.queryDashboardNameCheck,
      common.queryTemplateNameCheck
    ],
    action: templateActions.getTemplateElements
  },
  {
    path: `${ base }/copyTemplateElements`,
    method: "post",
    check: [
      common.bodyOriginDashboardNameCheck,
      common.bodyOriginTemplateNameCheck,
      common.bodyTargetDashboardNameCheck,
      common.bodyTargetTemplateNameCheck
    ],
    action: templateActions.copyTemplateElements
  },
  {
    path: `${ base }/updateTemplateElements`,
    method: "post",
    check: [common.bodyDashboardCheck],
    action: templateActions.updateTemplateElements
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
  {
    path: `${ base }/getElementLatestContent`,
    method: "get",
    check: [
      common.queryIdCheck,
      common.queryOptionalMarkNameCheck
    ],
    action: elementActions.getElementLatestContent
  },
]


export const gallery: utils.OrmRoute[] = [

  ...categoryRoutes,

  ...markRoutes,

  ...tagRoutes,

  ...contentRoutes,

  ...dashboardRoutes,

  ...templateRoutes,

  ...elementRoutes,

]

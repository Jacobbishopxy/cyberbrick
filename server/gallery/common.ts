/**
 * Created by Jacob Xie on 8/29/2020.
 */
import { Equal } from "typeorm"
import { body, query } from "express-validator"
import * as utils from "../utils"

// db name
export const db = "gallery"

// table name
export const category = "category"
export const dashboard = "dashboard"
export const template = "template"
export const element = "element"
export const content = "content"
export const mark = "mark"
export const tag = "tag"
export const author = "author"

// column name
export const id = "id"
export const name = "name"
export const date = "date"
export const text = "text"
export const title = "title"
export const contents = "contents"
export const elements = "elements"
export const templates = "templates"
export const marks = "marks"
export const tags = "tags"

// relations column & misc
export const ids = "ids"
export const names = "names"
export const markCategory = `${ mark }.${ category }`
export const markName = `${ mark }.${ name }`
export const categoryName = `${ category }.${ name }`
export const tagCategory = `${ tag }.${ category }`
export const tagName = `${ tag }.${ name }`

// column enum
export enum ElementType {
  EmbedLink = "embedLink",
  Text = "text",
  TargetPrice = "targetPrice",
  Image = "image",
  FileList = "fileList",
  FileManager = "fileManager",
  EditableTable = "editableTable",
  Table = "table",
  Lines = "lines",
  Histogram = "histogram",
  Pie = "pie",
  Scatter = "scatter",
  Heatmap = "heatmap",
  Box = "box",
  Tree = "tree",
  TreeMap = "treeMap",
}

// joint column name
export const elementsContents = `${ elements }.${ contents }`
export const templatesElements = `${ templates }.${ elements }`
export const templatesElementsContents = `${ templates }.${ elements }.${ contents }`

// query filters
export const whereDashboardAndTemplateNameEqual = (dn: string, tn: string) =>
  ({ where: { name: Equal(dn), "templates.name": Equal(tn) } })

export const whereDashboardNameAndTemplateEqual = (dn: string, tn: string) =>
  ({ where: { "dashboard.name": Equal(dn), name: Equal(tn) } })

// express validator
/**
 * general query param check
 */
export const queryFieldCheck = (field: string) =>
  query(field, utils.messageRequestQuery(field)).exists()

/**
 * general body field check
 */
export const bodyFieldCheck = (field: string) =>
  body(field, utils.messageRequestBody(field)).isLength({ min: 1 }).exists()

export const queryIdCheck = queryFieldCheck(id)
export const queryIdsCheck = queryFieldCheck(ids)
export const queryNameCheck = queryFieldCheck(name)
export const queryNamesCheck = queryFieldCheck(names)
export const queryDashboardNameCheck = queryFieldCheck("dashboardName")
export const queryTemplateNameCheck = queryFieldCheck("templateName")

export const bodyNameCheck = bodyFieldCheck(name)


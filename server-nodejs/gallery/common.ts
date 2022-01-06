/**
 * Created by Jacob Xie on 8/29/2020.
 */

import {Equal} from "typeorm"
import {Content} from "./entity/content.entity"

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
export const storage = "storage"

// column name
export const id = "id"
export const name = "name"
export const description = "description"
export const date = "date"
export const text = "text"
export const title = "title"
export const contents = "contents"
export const elements = "elements"
export const templates = "templates"
export const marks = "marks"
export const tags = "tags"
export const dashboards = "dashboards"
export const type = "type"
export const tabId = "tabId"

// relations column & misc
export const ids = "ids"
export const names = "names"
export const markCategory = `${mark}.${category}`
export const markName = `${mark}.${name}`
export const categoryName = `${category}.${name}`
export const categoryMarks = `${category}.${marks}`
export const tagCategory = `${tag}.${category}`
export const tagName = `${tag}.${name}`
export const contentId = `${content}.${id}`
export const contentElement = `${content}.${element}`
export const contentCategory = `${content}.${category}`
export const contentMark = `${content}.${mark}`
export const contentTags = `${content}.${tags}`
export const contentAuthor = `${content}.${author}`
export const contentDate = `${content}.${date}`
export const contentsDate = `${contents}.${date}`
export const templateId = `${template}.${id}`
export const templateName = `${template}.${name}`
export const templateDashboard = `${template}.${dashboard}`
export const elementId = `${element}.${id}`
export const elementType = `${element}.type`
export const elementTemplate = `${element}.${template}`
export const elementContents = `${element}.${contents}`
export const dashboardName = `${dashboard}.${name}`
export const dashboardCategory = `${dashboard}.${category}`
export const dashboardsTemplates = `${dashboards}.${templates}`

export const dateFormat = "YYYY-MM-DD"

// column enum
export enum ElementType {
  EmbedLink = "embedLink",
  Text = "text",
  Image = "image",
  FileOverview = "fileOverview",
  FileManager = "fileManager",
  XlsxTable = "xlsxTable",
  FlexTable = "flexTable",
  TargetPrice = "targetPrice",
  Universe = "universe",
  Line = "line",
  Bar = "bar",
  LineBar = "lineBar",
  Pie = "pie",
  Scatter = "scatter",
  LineScatter = "lineScatter",
  Heatmap = "heatmap",
  Box = "box",
  Tree = "tree",
  TreeMap = "treeMap",
  NestedModule = "nestedModule",
  FieldHeader = "fieldHeader",
  ConsensusDistribution = "consensusDistribution",
  Excel = "excel",
}

export enum flexTableType {
  file = "file",
  dataset = "dataset"
}
export const getElementType = (v: string) => {
  switch (v) {
    case "embedLink":
      return ElementType.EmbedLink
    case "text":
      return ElementType.Text
    case "image":
      return ElementType.Image
    case "fileOverview":
      return ElementType.FileOverview
    case "fileManager":
      return ElementType.FileManager
    case "xlsxTable":
      return ElementType.XlsxTable
    case "flexTable":
      return ElementType.FlexTable
    case "targetPrice":
      return ElementType.TargetPrice
    case "universe":
      return ElementType.Universe
    case "line":
      return ElementType.Line
    case "bar":
      return ElementType.Bar
    case "lineBar":
      return ElementType.LineBar
    case "pie":
      return ElementType.Pie
    case "scatter":
      return ElementType.Scatter
    case "lineScatter":
      return ElementType.LineScatter
    case "heatmap":
      return ElementType.Heatmap
    case "box":
      return ElementType.Box
    case "tree":
      return ElementType.Tree
    case "treeMap":
      return ElementType.TreeMap
    case "nestedModule":
      return ElementType.NestedModule
    case "fieldHeader":
      return ElementType.FieldHeader
    case "consensusDistribution":
      return ElementType.ConsensusDistribution
    case "excel":
      return ElementType.Excel
    default:
      return undefined
  }
}

export enum StorageType {
  PG = "postgres",
  MYSQL = "mysql",
  MSSQL = "mssql",
  MONGO = "mongodb"
}

export const getStorageType = (v: string) => {
  switch (v) {
    case "postgres":
      return StorageType.PG
    case "mongodb":
      return StorageType.MONGO
    default:
      return undefined
  }
}

// joint column name
export const elementsContents = `${elements}.${contents}`
export const elementsContentsMark = `${elements}.${contents}.${mark}`
export const templateElements = `${template}.${elements}`
export const templatesElements = `${templates}.${elements}`
export const templatesElementsContents = `${templates}.${elements}.${contents}`

// query filters
export const whereDashboardNameAndTemplateEqual = (dn: string, tn: string) =>
  ({where: [{"dashboard.name": Equal(dn)}, {name: Equal(tn)}]})

export const shouldQueryAfterReceivingContent = (v: string, content: Content) => {
  switch (v) {
    case ElementType.Text:
      return true
    case ElementType.Image:
      return true
    case ElementType.XlsxTable:
      return true
    default:
      return false
  }
}

export const ContentValidationByType = (v: string, data?: Record<string, any>) => {
  switch (v) {
    case ElementType.Text:
      return MongoContentValidation(data)
    case ElementType.Image:
      return MongoContentValidation(data)
    case ElementType.XlsxTable:
      return MongoContentValidation(data)
    default:
      return false
  }
}

export function MongoContentValidation(data?: Record<string, any>) {
  //to query a mongodb, we need mongo objectID and collection name
  if (data?.id && data?.collection) return true
  return false
}
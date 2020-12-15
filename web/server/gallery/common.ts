/**
 * Created by Jacob Xie on 8/29/2020.
 */

import {Equal} from "typeorm"

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

export const dateFormat = "YYYY-MM-DD"

// column enum
export enum ElementType {
  EmbedLink = "embedLink",
  Text = "text",
  TargetPrice = "targetPrice",
  Image = "image",
  FileList = "fileList",
  FileManager = "fileManager",
  XlsxTable = "xlsxTable",
  Table = "table",
  Line = "line",
  Bar = "bar",
  LineBar = "lineBar",
  Pie = "pie",
  Scatter = "scatter",
  Heatmap = "heatmap",
  Box = "box",
  Tree = "tree",
  TreeMap = "treeMap",
}

export const getElementType = (v: string) => {
  switch (v) {
    case "embedLink":
      return ElementType.EmbedLink
    case "text":
      return ElementType.Text
    case "targetPrice":
      return ElementType.TargetPrice
    case "image":
      return ElementType.Image
    case "fileList":
      return ElementType.FileList
    case "fileManager":
      return ElementType.FileManager
    case "xlsxTable":
      return ElementType.XlsxTable
    case "table":
      return ElementType.Table
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
    case "heatmap":
      return ElementType.Heatmap
    case "box":
      return ElementType.Box
    case "tree":
      return ElementType.Tree
    case "treeMap":
      return ElementType.TreeMap
    default:
      return undefined
  }
}

export enum StorageType {
  PG = "postgres"
}

export const getStorageType = (v: string) => {
  switch (v) {
    case "postgres":
      return StorageType.PG
    default:
      return undefined
  }
}

// joint column name
export const elementsContents = `${elements}.${contents}`
export const elementsContentsMark = `${elements}.${contents}.${mark}`
export const templatesElements = `${templates}.${elements}`
export const templatesElementsContents = `${templates}.${elements}.${contents}`

// query filters
export const whereDashboardNameAndTemplateEqual = (dn: string, tn: string) =>
  ({where: [{"dashboard.name": Equal(dn)}, {name: Equal(tn)}]})


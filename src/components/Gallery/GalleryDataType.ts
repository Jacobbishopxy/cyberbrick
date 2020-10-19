/**
 * Created by Jacob Xie on 9/18/2020.
 */

import moment from "moment"

// export const dateFormat = "YYYY-MM-DD HH:mm:ss"
export const dateFormat = "YYYY-MM-DD"
export const today = () => moment().format(dateFormat)
export const timeToString = (v: string) => moment(v).format(dateFormat)

export interface Category {
  name: string
  description?: string
  dashboard?: Dashboard
  marks?: Mark[]
  tags?: Tag[]
  contents?: Content[]
}

export interface Mark {
  id?: string
  name: string
  color?: string
  description?: string
  category?: Category
  contents?: Content[]
}

export interface Tag {
  id?: string
  name: string
  color?: string
  description?: string
  category?: Category
  contents?: Content[]
}

export interface Content {
  id?: string
  element?: Element
  category?: Category
  mark?: Mark
  tags?: Tag[]
  author?: Author
  date: string
  title?: string
  data: Record<string, any>
  config?: Record<string, any>
}

export interface Author {
  name: string
  description?: string
  contents?: Content[]
}

export interface Dashboard {
  name: string
  category?: Category
  templates?: Template[]
  description?: string
}

export interface Template {
  id?: string
  dashboard?: Dashboard
  elements?: Element[]
  name: string
  description?: string
}

export interface CopyTemplateElements {
  originDashboardName: string
  originTemplateName: string
  targetDashboardName: string
  targetTemplateName: string
}

export interface Element {
  id?: string
  template?: Template
  contents?: Content[]
  name: string
  type: ElementType
  timeSeries: boolean
  x: number
  y: number
  h: number
  w: number
}

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
      return ElementType.EmbedLink
  }
}


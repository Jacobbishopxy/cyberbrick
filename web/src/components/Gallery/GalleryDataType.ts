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
  dashboards?: Dashboard[]
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
  id?: string
  name: string
  category?: Category
  templates?: Template[]
  description?: string
}

export interface Template {
  id?: string
  dashboard?: Dashboard
  elements?: Element[]
  index?: number
  name: string
  description?: string
}

export interface CopyTemplateElements {
  originTemplateId: string
  targetTemplateId: string
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
    default:
      return ElementType.EmbedLink
  }
}

export enum StorageType {
  PG = "postgres"
}

export const storageTypeList = [
  "postgres"
]

export const getStorageType = (v: string) => {
  switch (v) {
    case "postgres":
      return StorageType.PG
    default:
      return undefined
  }
}

export interface StorageSimple {
  id: string
  name: string
  description?: string
}

export interface Storage {
  id?: string
  name: string
  description?: string
  type: StorageType
  host: string
  port: number
  database: string
  username: string
  password: string
}

export enum ConditionSymbol {
  Equal = "=",
  Greater = ">",
  GreaterEqual = ">=",
  Lesser = "<",
  LesserEqual = "<="
}

export interface Condition {
  field: string
  value: string | number
  symbol: ConditionSymbol
  junction?: "AND" | "OR"
}

export interface Read {
  selects?: string[]
  tableName: string
  conditions?: Condition[]
}


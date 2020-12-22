/**
 * Created by Jacob Xie on 9/18/2020.
 */

declare namespace GalleryAPI {

  export interface Category {
    name: string
    description?: string
    dashboard?: Dashboard
    marks?: Mark[]
    tags?: Tag[]
    contents?: Content[]
  }

  export interface Mark {
    id: string
    name: string
    color?: string
    description?: string
    category?: Category
    contents?: Content[]
  }

  export interface Tag {
    id: string
    name: string
    color?: string
    description?: string
    category?: Category
    contents?: Content[]
  }

  export interface Content {
    id: string
    element?: Element[]
    category?: Category
    mark?: Mark
    tags?: Tag[]
    author?: Author
    date: string
    title: string
    data: Record<string, any>
    config?: Record<string, any>
  }

  export interface Author {
    name: string
    description?: string
    contents?: Content[]
  }

  export interface Dashboard {
    id: string
    name: string
    category?: Category
    templates?: Template[]
    description?: string
  }

  export interface Template {
    id: string
    dashboard?: Dashboard
    elements?: Element[]
    index?: number
    name: string
    description: string
  }

  export interface CopyTemplateElements {
    originTemplateId: string
    targetTemplateId: string
  }

  export interface Element {
    id: string
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
    LineBar = "lineBar",
    Pie = "pie",
    Scatter = "scatter",
    Heatmap = "heatmap",
    Box = "box",
    Tree = "tree",
    TreeMap = "treeMap",
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
  }

  export interface Read {
    selects?: string[]
    tableName: string
    conditions?: Condition[]
  }
}

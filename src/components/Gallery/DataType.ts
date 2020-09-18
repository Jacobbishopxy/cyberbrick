/**
 * Created by Jacob Xie on 9/18/2020.
 */

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
  name: string
  category?: Category
  templates?: Template[]
  description?: string
}

export interface Template {
  id: string
  dashboard?: Dashboard
  elements?: Element[]
  name: string
  description: string
}

export interface CopyTemplateElements {
  originDashboardName: string
  originTemplateName: string
  targetDashboardName: string
  targetTemplateName: string
}

export interface Element {
  id: string
  template?: Template
  contents?: Content[]
  name: string
  type: ElementType
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


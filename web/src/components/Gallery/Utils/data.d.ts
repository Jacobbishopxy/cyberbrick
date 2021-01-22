/**
 * Created by Jacob Xie on 12/4/2020
 */

/**
 * Generic data type for table & chart
 */

export type ViewStyle = "default" | "xlsx"

export type ColumnTypeOptions = "default" | "date" | "number" | "percent" | "bar"

export type DataSelectedType = "dataset" | "file"

export interface DisplayType {
  column: string
  type: ColumnTypeOptions
}

export interface GeneralTableConfigInterface {
  type: DataSelectedType
  display: DisplayType[]
  style: ViewStyle
  view: string[]
}

export interface XlsxTableConfigInterface {
  hideOptions: string[]
}

export interface XAxis {
  name?: string
  column: string
  type: "value" | "category" | "time" | "log"
}

export interface YAxis {
  name?: string
  position: "left" | "right" | undefined
  columns: string[]
}

export interface ChartConfig {
  bar?: string[]
  x: XAxis
  y: YAxis[]
  yDefaultName: string
  display?: DisplayType[]
}

export interface ChartData {
  id: string
  selects: string[]
  tableName: string
  date: string
}

export interface Chart {
  config: ChartConfig,
  data: ChartData
}


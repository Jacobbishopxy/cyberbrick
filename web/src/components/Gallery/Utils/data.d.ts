/**
 * Created by Jacob Xie on 12/4/2020
 */

import { EChartOption } from "echarts"

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

export interface Scatter {
  column: string
  size?: string
  min?: number
  max?: number
}

export interface CartesianCoordSysChartConfig {
  bar?: string[]
  scatter?: Scatter[]
  x: XAxis
  y: YAxis[]
  display?: DisplayType[]
  styling?: string
}

export interface ChartData {
  id: string
  selects: string[]
  tableName: string
  date: string
}

export interface Chart {
  config: CartesianCoordSysChartConfig,
  data: ChartData
}

export interface SeriesPieChartConfig {
  select: string
  seriesDir: "vertical" | "horizontal"
  display?: DisplayType[]
  styling?: string
}

export type UnionChartConfig = CartesianCoordSysChartConfig | SeriesPieChartConfig

export type ChartOptionGenerator = (data: any[], config: UnionChartConfig) => EChartOption

export type Mixin = "line" | "bar" | "scatter" | "lineBar" | "lineScatter" | "pie" | undefined


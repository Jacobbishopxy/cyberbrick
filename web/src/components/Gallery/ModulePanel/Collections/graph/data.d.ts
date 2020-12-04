/**
 * Created by Jacob Xie on 12/4/2020
 */

export interface Y {
  position: "left" | "right" | undefined
  columns: string[]
}

export interface ChartConfig {
  bar?: string[]
  x: {
    column: string
    type: "value" | "category" | "time" | "log"
  }
  y: Y[]
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


/**
 * Created by Jacob Xie on 1/14/2021
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
  view: ViewOption[]
}


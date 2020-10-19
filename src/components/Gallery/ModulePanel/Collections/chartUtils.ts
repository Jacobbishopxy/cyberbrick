/**
 * Created by Jacob Xie on 10/19/2020.
 */

import _ from "lodash"
import { EChartOption } from "echarts"

import * as DataType from "../../GalleryDataType"


export interface GenericGraphConfig {
  dataIndexDir: "vertical" | "horizontal"
}

export interface LineConfig extends GenericGraphConfig {
}

const genLineSeries = (data: [][], direction: "vertical" | "horizontal") => {
  if (direction === "vertical")
    return _.range(data[0].length - 1).map(() => ({
      type: "line",
      smooth: true,
    }))
  return _.range(data.length - 1).map(() => ({
    type: "line",
    smooth: true,
    seriesLayoutBy: "row"
  }))
}

export const genLineChartOption = (content: DataType.Content): EChartOption => {

  const d = content.data.data
  const c = content.config!

  return {
    title: {},
    tooltip: {},
    legend: {},
    dataset: [{ source: d }],
    xAxis: {
      type: "category"
    },
    yAxis: {},
    series: genLineSeries(d, c.dataIndexDir)
  }
}


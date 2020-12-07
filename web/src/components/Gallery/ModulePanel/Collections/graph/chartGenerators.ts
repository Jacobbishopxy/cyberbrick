/**
 * Created by Jacob Xie on 10/19/2020.
 */

import {EChartOption} from "echarts"

import {ChartConfig} from "./data"


const generateYAxis = (config: ChartConfig) => {

  let left = -1
  let right = -1

  return config.y.map((item, idx) => {

    let offsetNum = 0

    if (item.position === "left") {
      left += 1
      offsetNum = left
    }
    if (item.position === "right") {
      right += 1
      offsetNum = right
    }

    return {
      position: item.position,
      splitLine: {show: idx === 0},
      offset: offsetNum * 50
    }
  })
}

type ChartType = "line" | "bar" | "mixin"

const generateSeries = (config: ChartConfig, chartType: ChartType): [EChartOption.Series[], string[]] => {
  const series: EChartOption.Series[] = []
  const legend: string[] = []
  config.y.forEach((item, idx) => {
    item.columns.forEach(c => {
      const ss = {
        yAxisIndex: idx,
        name: c,
        encode: {
          x: config.x,
          y: c,
          tooltip: [config.x, c]
        }
      }
      if (chartType === "mixin")
        config.bar?.includes(c) ?
          series.push({...ss, type: "bar"}) :
          series.push({...ss, type: "line"})
      else
        series.push({...ss, type: chartType})
      legend.push(c)
    })
  })
  return [series, legend]
}

/**
 * generate line, bar chart option
 */
export const generateLineBarOption = (chartType: ChartType) =>
  (data: any[], config: ChartConfig): EChartOption => {
    const [series, legend] = generateSeries(config, chartType)
    return {
      tooltip: {},
      legend: {data: legend},
      dataset: [{source: data}],
      xAxis: [{type: config.x.type}],
      yAxis: generateYAxis(config),
      series
    }
  }


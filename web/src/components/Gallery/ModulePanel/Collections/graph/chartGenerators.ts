/**
 * Created by Jacob Xie on 10/19/2020.
 */

import {EChartOption} from "echarts"

import {ChartConfig} from "./data"


const generateYAxis = (config: ChartConfig) =>
  config.y.map((item, idx) => ({
    position: item.position,
    splitLine: {show: idx === 0}
  }))

type ChartType = "line" | "bar" | "mixin"

const generateSeries = (config: ChartConfig, chartType: ChartType): [EChartOption.Series[], string[]] => {
  const s: EChartOption.Series[] = []
  const l: string[] = []
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
          s.push({...ss, type: "bar"}) :
          s.push({...ss, type: "line"})
      else
        s.push({...s, type: chartType})
      l.push(c)
    })
  })
  return [s, l]
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
      xAxis: [{type: "time"}],
      yAxis: generateYAxis(config),
      series
    }
  }





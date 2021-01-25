/**
 * Created by Jacob Xie on 10/19/2020.
 */

import {EChartOption} from "echarts"
import _ from "lodash"

import {ChartConfig, Scatter} from "@/components/Gallery/Utils/data"
import {Mixin} from "./data"
import {genDisplayConfig, transformRowDataForChart} from "@/components/Gallery/Utils/rawDataTransform"


const generateXAxis = (config: ChartConfig): EChartOption.XAxis[] => {
  return [
    {
      type: config.x.type,
      name: config.x.name,
      nameLocation: "middle",
      nameGap: 20
    }
  ]
}

const generateYAxis = (config: ChartConfig): EChartOption.YAxis[] => {

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
      name: item.name,
      position: item.position,
      splitLine: {show: idx === 0},
      offset: offsetNum * 50
    }
  })
}

const generateSeries = (config: ChartConfig, chartType: Mixin): [EChartOption.Series[], string[]] => {
  const series: EChartOption.Series[] = []
  const legend: string[] = []

  const scatter = config.scatter ?
    _.reduce(config.scatter, (acc: Record<string, any>, v: Scatter) => {
      return {...acc, [v.column]: v.size}
    }, {}) : {}

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

      if (chartType === "scatter") {
        const sizeCol = scatter[c]
        series.push({
          ...ss,
          type: "scatter",
          symbolSize: (data: Record<string, number>) => data[sizeCol],
          encode: {
            ...ss.encode,
            tooltip: [config.x, c, sizeCol]
          }
        })
      } else if (chartType === "lineBar")
        config.bar?.includes(c) ?
          series.push({...ss, type: "bar"}) :
          series.push({...ss, type: "line"})
      else if (chartType === "lineScatter") {
        const sizeCol = scatter[c]
        sizeCol ?
          series.push({
            ...ss,
            type: "scatter",
            symbolSize: (data: Record<string, number>) => data[sizeCol],
            encode: {
              ...ss.encode,
              tooltip: [config.x, c, sizeCol]
            }
          }) :
          series.push({...ss, type: "line"})
      } else
        series.push({...ss, type: chartType})

      legend.push(c)
    })
  })

  console.log("series", series)

  return [series, legend]
}

/**
 * generate line, bar chart option
 */
export const generateCommonOption = (chartType: Mixin) =>
  (data: any[], config: ChartConfig): EChartOption => {
    const [series, legend] = generateSeries(config, chartType)

    let d
    if (config.display) {
      const display = genDisplayConfig(data, config.display, "dataset")
      d = data.map(i => transformRowDataForChart(i, display))
    } else
      d = data

    return {
      tooltip: {},
      legend: {data: legend},
      dataset: [{source: d}],
      xAxis: generateXAxis(config),
      yAxis: generateYAxis(config),
      // todo: visual map for scaling size columns
      series
    }
  }


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

const getScatterMap = (config: ChartConfig, value: "size" | "min" | "max") =>
  config.scatter ?
    _.reduce(config.scatter, (acc: Record<string, any>, v: Scatter) => {
      return {...acc, [v.column]: v[value]}
    }, {}) : {}

const generateSeries = (config: ChartConfig, chartType: Mixin): [EChartOption.Series[], string[]] => {
  const series: EChartOption.Series[] = []
  const legend: string[] = []

  const scatterMap = getScatterMap(config, "size")

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
        const sizeCol = scatterMap[c]
        series.push({
          ...ss,
          type: "scatter",
          symbolSize: (data: Record<string, number>) => (data[sizeCol] || 50),
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
        const sizeCol = scatterMap[c]
        sizeCol ?
          series.push({
            ...ss,
            type: "scatter",
            symbolSize: (data: Record<string, number>) => (data[sizeCol] || 50),
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

  return [series, legend]
}

const getDataSourceMinMax = (data: Record<string, any>[], column: string) => {
  const col = _.map(data, i => i[column])
  return [_.min(col), _.max(col)]
}

const generateVisualMapForScatter = (
  data: Record<string, any>[],
  config: ChartConfig,
  chartType: Mixin
): EChartOption.VisualMap[] => {
  const visualMap: any[] = []
  let seriesIndex = 0

  const scatterSizeMap = getScatterMap(config, "size")
  const scatterMinMap = getScatterMap(config, "min")
  const scatterMaxMap = getScatterMap(config, "max")

  config.y.forEach(item => {
    item.columns.forEach(c => {
      const vm = {
        show: false,
        type: "continuous",
        name: c,
        seriesIndex: seriesIndex
      }

      const [min, max] = getDataSourceMinMax(data, scatterSizeMap[c])

      if (chartType === "scatter") {
        const dimension = scatterSizeMap[c]
        dimension ?
          visualMap.push({
            ...vm,
            dimension,
            min,
            max,
            inRange: {
              symbolSize: [scatterMinMap[c], scatterMaxMap[c]]
            }
          }) : undefined
      } else if (chartType === "lineScatter") {
        const sizeCol = scatterSizeMap[c]
        const dimension = scatterSizeMap[c]
        sizeCol && dimension ?
          visualMap.push({
            ...vm,
            dimension,
            min,
            max,
            inRange: {
              symbolSize: [scatterMinMap[c], scatterMaxMap[c]]
            }
          }) : undefined
      }
      seriesIndex += 1
    })
  })

  return visualMap
}

const generateVisualMap = (
  data: Record<string, any>[],
  config: ChartConfig,
  chartType: Mixin
): EChartOption.VisualMap[] => {
  switch (chartType) {
    case "scatter":
      return generateVisualMapForScatter(data, config, chartType)
    case "lineScatter":
      return generateVisualMapForScatter(data, config, chartType)
    default:
      return []
  }
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
      visualMap: generateVisualMap(d, config, chartType),
      series
    }
  }


export const generatePieOption = () =>
  (data: any[], config: ChartConfig): EChartOption => {

    return {}
  }


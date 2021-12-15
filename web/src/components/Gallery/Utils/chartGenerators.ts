/**
 * Created by Jacob Xie on 10/19/2020.
 */

import { EChartOption } from "echarts"
import _ from "lodash"

import { CartesianCoordSysChartConfig, Mixin, Scatter, SeriesPieChartConfig } from "./data"
import { genDisplayConfig, transformRowDataForChart } from "@/components/Gallery/Utils/rawDataTransform"
import XYTransposition from "@/pages/demo/Charts/XYTransposition"


const generateXAxis = (config: CartesianCoordSysChartConfig): EChartOption.XAxis[] | undefined => {
  console.log(16, config)
  if (config.x) {

    return [
      {
        type: config.x.type,
        name: config.x.name,
        nameLocation: "middle",
        nameGap: 20,
        // x轴配置
        axisLabel: {
          // name的间隔显示
          interval: 0,
          // 倾斜角度
          rotate: 45
        }

      }
    ]
  }
  return
}

const generateYAxis = (config: CartesianCoordSysChartConfig): EChartOption.YAxis[] | undefined => {

  let left = -1
  let right = -1
  console.log(27, config)
  if (config.y) {
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
        splitLine: { show: idx === 0 },
        offset: offsetNum * 50,
        type: item.type
      }
    })
  }
  return

}

const getScatterMap = (config: CartesianCoordSysChartConfig, value: "size" | "min" | "max") =>
  config.scatter ?
    _.reduce(config.scatter, (acc: Record<string, any>, v: Scatter) => {
      return { ...acc, [v.column]: v[value] }
    }, {}) : {}

const generateSeries = (config: CartesianCoordSysChartConfig, chartType: Mixin): [EChartOption.Series[], string[]] => {
  const series: EChartOption.Series[] = []
  const legend: string[] = []

  const scatterMap = getScatterMap(config, "size")
  if (chartType === 'scatter') [
    console.log(28, config)
  ]
  if (config.y) {
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

        //   散点图
        if (chartType === "scatter") {

          const sizeCol = scatterMap[c]
          series.push({
            ...ss,
            type: "scatter",
            symbolSize: (data: Record<string, number>) => {

              return data[sizeCol] || 10
            },
            encode: {
              ...ss.encode,
              tooltip: [config.x, c, sizeCol]
            }
          })
        } else if (chartType === "lineBar")
          config.bar?.includes(c) ?
            series.push({ ...ss, type: "bar" }) :
            series.push({ ...ss, type: "line" })
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
            series.push({ ...ss, type: "line" })
        } else {
          series.push({ ...ss, type: chartType })
        }

        legend.push(c)
      })
    })
  }


  return [series, legend]
}

const getDataSourceMinMax = (data: Record<string, any>[], column: string) => {
  const col = _.map(data, i => i[column])
  return [_.min(col), _.max(col)]
}

const generateVisualMapForScatter = (
  data: Record<string, any>[],
  config: CartesianCoordSysChartConfig,
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
  config: CartesianCoordSysChartConfig,
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
 * generate line, bar, scatter chart option
 */
export const generateCommonOption = (chartType: Mixin) =>
  (data: any[], config: CartesianCoordSysChartConfig): EChartOption => {
    const [series, legend] = generateSeries(config, chartType)

    let d
    if (config.display) {
      const display = genDisplayConfig(data, config.display, "dataset")
      d = data.map(i => transformRowDataForChart(i, display))
    } else
      d = data
    if (chartType === 'scatter') {
    }
    const isisTransposition = config.isTransposition && config.isTransposition.length > 0

    console.log(203, config, chartType, data, series, legend, d, generateXAxis(config), generateYAxis(config))

    // 如果XY转置，需求修改xAxis和yAxis和series.encode
    return {
      tooltip: {},
      legend: { data: legend },
      dataset: [{ source: d }],
      xAxis: isisTransposition ? generateYAxis(config) : generateXAxis(config),
      yAxis: isisTransposition ? generateXAxis(config) : generateYAxis(config),
      // 会导致冲突的配置
      // visualMap: generateVisualMap(d, config, chartType),
      series: isisTransposition ? series.map((v) => {
        const y = v.encode.y
        const x = v.encode.x
        const yAxisIndex = v.yAxisIndex
        const newV = _.omit(v, 'yAxisIndex')
        console.log(251, newV, yAxisIndex)
        return {
          ...newV,
          xAxisIndex: yAxisIndex,
          encode: {
            ...newV.encode,
            x: y,
            y: x
          }
        }
      }) : series
    }
  }

const genPctRadius = (len: number) => `${1 / (len + 2) * 100}%`
const genPctArr = (len: number, type?: string) => {
  if (type === 'pie') {
    const aPart = 1 / (len * 2)
    let temp = aPart
    let arr: string[] = []
    for (let i = 0; i < len; i++) {
      arr[i] = `${temp * 100}%`;
      temp += 2 * aPart
    }
    return arr
  } else {
    const end = len + 3
    const arr = _.range(1, end)

    return arr.map((i: number) => `${i / end * 100}%`).slice(1, -1)
  }
}

const getPieSeriesName = (data: any[], config: SeriesPieChartConfig) => {
  if (config.seriesDir === "vertical")
    return _.keys(_.omit(data[0], config.select))
  if (config.seriesDir === "horizontal")
    return _.map(data, i => i[config.select])
  return []
}

const genPieSeries = (seriesName: any[], config: SeriesPieChartConfig) => {

  const radius = genPctRadius(seriesName.length)
  const pctArr = genPctArr(seriesName.length, 'pie')
  // const pctArr = genPctArr(5)
  console.log(246, config, seriesName, pctArr)
  const defaultOpt = (i: number) => ({
    type: "pie",
    radius,
    center: [pctArr[i], "50%"],
    label: {
      position: 'outer',
      alignTo: 'labelLine',
      bleedMargin: 5
    },
  })

  const iter = _.range(seriesName.length)

  if (config.seriesDir === "vertical")
    return iter.map(i => ({
      ...defaultOpt(i),
      encode: {
        itemName: config.select,
        value: seriesName[i]
      },
    }))

  if (config.seriesDir === "horizontal")
    return iter.map(i => ({
      ...defaultOpt(i),
      datasetIndex: i
    }))

  return []
}

const genPieSubText = (seriesName: string[]) => {
  const centerArr = genPctArr(seriesName.length)
  const top = `${1 / (seriesName.length + 2) * 100 + 50}%`

  return seriesName.map((n, idx) => ({
    subtext: n,
    left: centerArr[idx],
    top,
    textAlign: "center"
  }))
}

const transformPieHorizontalData = (data: any[], select: string) =>
  _.map(data, item =>
    _.map(_.entries(_.omit(item, select)), ([k, v]) => ({
      name: k, value: v
    }))
  )

const genPieDataset = (data: any[], config: SeriesPieChartConfig) => {
  if (config.seriesDir === "horizontal")
    return transformPieHorizontalData(data, config.select).map(i => ({ source: i }))
  else
    return [{ source: data }]
}


/**
* generate pie option
*/
export const generatePieOption = () =>
  (data: any[], config: SeriesPieChartConfig): EChartOption => {
    let d
    if (config.display) {
      const display = genDisplayConfig(data, config.display, "dataset")
      d = data.map(i => transformRowDataForChart(i, display))
    } else
      d = data

    const seriesName = getPieSeriesName(d, config)

    // const t = genPieSeries(seriesName, config).map((v, i) => {
    //     if (i === 0) {
    //         return {
    //             ...v,
    //             // center: ['10%', '50%']
    //         }
    //     }
    //     return v

    // })
    console.log(316, genPieSeries(seriesName, config))
    return {
      tooltip: {},
      legend: {},
      title: genPieSubText(seriesName),
      dataset: genPieDataset(d, config),
      series: genPieSeries(seriesName, config)

    }
  }


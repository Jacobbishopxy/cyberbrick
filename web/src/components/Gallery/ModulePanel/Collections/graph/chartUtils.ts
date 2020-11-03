/**
 * Created by Jacob Xie on 10/19/2020.
 */

import _ from "lodash"
import {EChartOption} from "echarts"

import * as DataType from "../../../GalleryDataType"

const genSeries = (chartType: string, data: any[][]) => {
  return _.range(data.length - 1).map(() => ({
    type: chartType,
    smooth: true,
    seriesLayoutBy: "row"
  }))
}

/**
 * generate line or bar chart option
 */
export const generateChartOption = (chartType: string) =>
  (content: DataType.Content): EChartOption => {

    const d = content.data.data

    return {
      tooltip: {},
      legend: {},
      dataset: [{source: d}],
      xAxis: {
        type: "category"
      },
      yAxis: {},
      series: genSeries(chartType, d)
    }
  }

const genPctRadius = (num: number) => `${1 / num * 100}%`
const genPctArr = (num: number) => {
  const end = num + 3
  const arr = _.range(1, end)

  return arr.map((i: number) => `${i / end * 100}%`).slice(1, -1)
}
const genPieSeries = (data: any[][]) => {
  const encodeName = data[0][0]
  const encodeArr = data[0].slice(1)
  const encodeArrLen = encodeArr.length
  const radius = genPctRadius(encodeArrLen)
  const pctArr = genPctArr(encodeArrLen)

  return encodeArr.map((value, idx) => ({
    type: "pie",
    radius,
    center: [pctArr[idx], "50%"],
    label: {alignTo: 'labelLine'},
    encode: {
      itemName: encodeName,
      value
    },
  }))
}

/**
 * generate pie chart option
 */
export const generatePieOption = () =>
  (content: DataType.Content): EChartOption => {

    const d = content.data.data

    return {
      tooltip: {},
      legend: {},
      dataset: [{source: d}],
      series: genPieSeries(d)
    }
  }

const genLineBarSeries = (data: any[][], lineArr: string[]) => {
  const x = data[0][0]

  return data.slice(1).map((arr: any[]) => {
    const name = arr[0] as string
    if (lineArr.includes(name))
      return {
        type: "line",
        seriesLayoutBy: "row",
        yAxisIndex: 1,
        name,
        encode: {
          x,
          y: name,
          tooltip: [x, name]
        }
      }
    return {
      type: "bar",
      seriesLayoutBy: "row",
      yAxisIndex: 0,
      name,
      encode: {
        x,
        y: name,
        tooltip: [x, name]
      }
    }
  })
}

/**
 * generate line + bar chart option
 */
export const generateLineBarOption = () =>
  (content: DataType.Content): EChartOption => {

    const c = content.config!
    const d = content.data.data
    const legendData = d.map((arr: any[]) => arr[0])

    return {
      tooltip: {},
      legend: {data: legendData},
      dataset: [{source: d}],
      xAxis: [{type: "category"}],
      yAxis: [
        {position: "left"},
        {position: "right", splitLine: {show: false}}
      ],
      series: genLineBarSeries(d, c.lineArr)
    }
  }




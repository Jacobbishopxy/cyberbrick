/**
 * Created by Jacob Xie on 10/19/2020.
 */

import _ from "lodash"
import { EChartOption } from "echarts"

import * as DataType from "../../../GalleryDataType"


type DataIndexDirection = "vertical" | "horizontal"

const convertChartData = (d: any[][], dataIndexDirection: DataIndexDirection) => {
  if (dataIndexDirection === "vertical") return _.zip(...d)
  return d
}

const genSeries = (chartType: string, data: any[][]) => {
  return _.range(data.length - 1).map(() => ({
    type: chartType,
    smooth: true,
    seriesLayoutBy: "row"
  }))
}

export const generateChartOption = (chartType: string) =>
  (content: DataType.Content): EChartOption => {

    const c = content.config!
    const d = convertChartData(content.data.data, c.dataIndexDir)

    return {
      tooltip: {},
      legend: {},
      dataset: [{ source: d }],
      xAxis: {
        type: "category"
      },
      yAxis: {},
      series: genSeries(chartType, d)
    }
  }

const genPctRadius = (len: number) => `${ 1 / len * 100 }%`
const genPctArr = (d: any[]) => {
  const end = d.length + 2
  const arr = _.range(1, end)

  return arr.map((i: number) => `${ i / end * 100 }%`).slice(1, -1)
}


const genPieSeries = (data: any[][]) => {
  const encodeName = data[0][0]
  const encodeArr = data[0].slice(1)
  const radius = genPctRadius(encodeArr.length)
  const pctArr = genPctArr(data[0])

  return _.range(encodeArr.length).map(i => ({
    type: "pie",
    radius,
    center: [pctArr[i], "50%"],
    label: { alignTo: 'labelLine' },
    encode: {
      itemName: encodeName,
      value: encodeArr[i]
    },
  }))
}

export const generatePieOption = () =>
  (content: DataType.Content): EChartOption => {

    const c = content.config!
    const d = convertChartData(content.data.data, c.dataIndexDir)
    const data = _.concat([d[0].map((i: any) => i.toString())], d.slice(1))

    return {
      tooltip: {},
      legend: {},
      dataset: [{ source: data }],
      series: genPieSeries(data)
    }
  }


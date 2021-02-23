/**
 * Created by Jacob Xie on 2/23/2021
 */

import {EChartOption} from "echarts"
import ReactEcharts from "echarts-for-react"
import _ from "lodash"

import {data} from "./mock/pie"
import {ChartsProps} from "./data"
import {genPctArr, genPctRadius} from "@/components/Gallery/ModulePanel/Collections/graph/utils/chartGenerators"


const radiusSiz = genPctRadius(4)
const centerArr = genPctArr([1, 2, 3, 4])



const transformedData = _.map(data, item =>
  _.map(_.entries(_.omit(item, "year")), ([k, v]) => ({
    name: k,
    value: v
  }))
)


const chartOption: EChartOption = {
  legend: {},
  tooltip: {},
  title: [
    {
      subtext: "2011",
      left: centerArr[0],
      top: "75%"
    },
    {
      subtext: "2012",
      left: centerArr[1],
      top: "75%"
    },
    {
      subtext: "2013",
      left: centerArr[2],
      top: "75%"
    },
    {
      subtext: "2014",
      left: centerArr[3],
      top: "75%"
    },
  ],
  dataset: [
    {source: transformedData[0]},
    {source: transformedData[1]},
    {source: transformedData[2]},
    {source: transformedData[3]},
  ],
  series: [
    {
      type: "pie",
      radius: radiusSiz,
      center: [centerArr[0], "50%"],
      // encode: {
      //   itemName: "year",
      //   value: "v1"
      // },
      datasetIndex: 0
    },
    {
      type: "pie",
      radius: radiusSiz,
      center: [centerArr[1], "50%"],
      // encode: {
      //   itemName: "year",
      //   value: "v2"
      // },
      datasetIndex: 1
    },
    {
      type: "pie",
      radius: radiusSiz,
      center: [centerArr[2], "50%"],
      // encode: {
      //   itemName: "year",
      //   value: "v3"
      // },
      datasetIndex: 2
    },
    {
      type: "pie",
      radius: radiusSiz,
      center: [centerArr[3], "50%"],
      // encode: {
      //   itemName: "year",
      //   value: "v4"
      // },
      datasetIndex: 3
    },
  ]
}

/**
 * multi-series pie
 */
export const Pie = (props: ChartsProps) =>
  <ReactEcharts
    option={chartOption}
    opts={{height: props.chartHeight}}
    theme={props.theme}
  />

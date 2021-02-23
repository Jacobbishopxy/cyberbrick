/**
 * Created by Jacob Xie on 2/23/2021
 */

import {EChartOption} from "echarts"
import ReactEcharts from "echarts-for-react"

import {data} from "./mock/pie"
import {ChartsProps} from "./data"


const chartOption: EChartOption = {
  legend: {},
  tooltip: {},
  dataset: [{source: data}],
  series: [
    {
      type: "pie",
      radius: "20%",
      center: ["25%", "30%"],
      encode: {
        itemName: "product",
        value: 2012
      }
    },
    {
      type: "pie",
      radius: "20%",
      center: ["75%", "30%"],
      encode: {
        itemName: "product",
        value: 2013
      }
    },
    {
      type: "pie",
      radius: "20%",
      center: ["25%", "75%"],
      encode: {
        itemName: "product",
        value: 2014
      }
    },
    {
      type: "pie",
      radius: "20%",
      center: ["75%", "75%"],
      encode: {
        itemName: "product",
        value: 2015
      }
    },
  ]
}

export const Pie = (props: ChartsProps) =>
  <ReactEcharts
    option={chartOption}
    opts={{height: props.chartHeight}}
    theme={props.theme}
  />

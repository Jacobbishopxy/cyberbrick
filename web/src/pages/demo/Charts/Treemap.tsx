/**
 * Created by Jacob Xie on 2/17/2021
 */

import {EChartOption} from "echarts"
import ReactEcharts from "echarts-for-react"

import {data} from "./mock/treemap"
import {ChartsProps} from "./data"


const chartOption: EChartOption = {
  tooltip: {},
  series: [
    {
      type: "treemap",
      data,
    }
  ]
}


export const Treemap = (props: ChartsProps) =>
  <ReactEcharts
    option={chartOption}
    opts={{height: props.chartHeight}}
    theme={props.theme}
  />


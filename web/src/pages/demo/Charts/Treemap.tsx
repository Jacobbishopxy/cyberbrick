/**
 * Created by Jacob Xie on 2/17/2021
 */

import React from "react"
import {EChartOption} from "echarts"
import ReactEcharts from "echarts-for-react"

import {data} from "./mock/treemap"


const chartOption: EChartOption = {
  tooltip: {},
  series: [
    {
      type: "treemap",
      data,
    }
  ]
}

interface TreemapProps {
  chartHeight: number
  theme: string
}

export const Treemap = (props: TreemapProps) => {

  return (
    <ReactEcharts
      option={chartOption}
      opts={{height: props.chartHeight}}
      theme={props.theme}
    />
  )
}


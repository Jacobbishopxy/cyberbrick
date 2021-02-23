/**
 * Created by Jacob Xie on 1/28/2021
 */

import {EChartOption} from "echarts"
import ReactEcharts from "echarts-for-react"

import {data} from "./mock/ls"
import {ChartsProps} from "./data"


const chartOption: EChartOption = {
  tooltip: {},
  legend: {
    data: ['trick', 'alpha', 'trend1', 'trend2']
  },
  dataset: [
    {
      source: data
    }
  ],
  xAxis: [
    {type: 'category'},
  ],
  yAxis: [
    {
      type: "value",
      name: "Line",
      position: "left",
    },
    {
      type: "value",
      name: "Scatter1",
      position: "right",
      splitLine: {show: false}
    },
    {
      type: "value",
      name: "Scatter2",
      position: "right",
      splitLine: {show: false},
      offset: 100
    },

  ],
  series: [
    {
      type: 'line',
      yAxisIndex: 0,
      name: "trick",
      encode: {
        x: "time",
        y: "trick",
        tooltip: ["trick"]
      }
    },
    {
      type: 'scatter',
      yAxisIndex: 1,
      name: "alpha",
      encode: {
        x: "time",
        y: "alpha",
        tooltip: ["time", "alpha", "beta"]
      },
      symbolSize: (data: Record<string, number>) => (data["beta"] || 50)
    },
    {
      type: 'scatter',
      yAxisIndex: 1,
      name: "trend1",
      encode: {
        x: "time",
        y: "trend1",
        tooltip: ["time", "trend1", "area1"]
      },
      symbolSize: (data: Record<string, number>) => data["area1"]
    },
    {
      type: 'scatter',
      yAxisIndex: 2,
      name: "trend2",
      encode: {
        x: "time",
        y: "trend2",
        tooltip: ["time", "trend2", "area2"]
      },
      symbolSize: (data: Record<string, number>) => data["area2"]
    },
  ],
  visualMap: [
    {
      show: false,
      dimension: "beta",
      seriesIndex: [1],
      min: 0,
      max: 100,
      inRange: {
        symbolSize: [0, 100]
      }
    },
    {
      show: false,
      dimension: "area1",
      seriesIndex: [2],
      min: 0,
      max: 1,
      inRange: {
        symbolSize: [0, 100]
      }
    },
    {
      show: false,
      dimension: "area2",
      seriesIndex: [3],
      min: 0,
      max: 1,
      inRange: {
        symbolSize: [0, 100]
      }
    },
  ]
}


/**
 * multi y-axes line & scatter mixin plot
 */
export const LineScatter = (props: ChartsProps) =>
  <ReactEcharts
    option={chartOption}
    opts={{height: props.chartHeight}}
    theme={props.theme}
  />


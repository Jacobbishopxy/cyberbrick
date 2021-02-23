/**
 * Created by Jacob Xie on 2/8/2021
 */

import {EChartOption} from "echarts"
import ReactEcharts from "echarts-for-react"

import {data} from "./mock/candlestick"
import {ChartsProps} from "./data"


const chartOption: EChartOption = {
  tooltip: {
    // trigger: "axis",
    axisPointer: {type: "cross"}
  },
  legend: {
    data: ["candlestick", "volume"],
    left: "center",
  },
  dataset: [{source: data}],
  grid: [
    {
      left: "5%",
      right: "5%",
      top: "5%",
      height: "65%"
    },
    {
      left: "5%",
      right: "5%",
      top: "75%",
      height: "20%"
    },
  ],
  axisPointer: {
    link: [
      {xAxisIndex: 'all'}
    ],
    label: {
      backgroundColor: '#777'
    }
  },
  xAxis: [
    {
      type: "category"
    },
    {
      type: "category",
      gridIndex: 1
    },
  ],
  yAxis: [
    {
      scale: true
    },
    {
      scale: true,
      gridIndex: 1,
      axisLabel: {show: false},
      axisLine: {show: false},
      axisTick: {show: false},
      splitLine: {show: false}
    }
  ],
  series: [
    {
      name: "candlestick",
      type: "candlestick",
      encode: {
        x: "date",
        y: ["open", "close", "high", "low"]
      },
      tooltip: {
        formatter: ((params: any) => {
          return [
            "Date: " + params.value["date"] + "<hr size=1 style='margin: 3px 0'>",
            "Open: " + params.value["open"] + "<br/>",
            "High: " + params.value["high"] + "<br/>",
            "Low: " + params.value["low"] + "<br/>",
            "Close: " + params.value["close"] + "<br/>",
            "Volume: " + params.value["volume"] + "<br/>",
          ].join('')
        })
      }
    },
    {
      name: "volume",
      type: "bar",
      encode: {
        x: "date",
        y: "volume"
      },
      xAxisIndex: 1,
      yAxisIndex: 1
    }
  ]
}

export const Candlestick = (props: ChartsProps) =>
  <ReactEcharts
    option={chartOption}
    opts={{height: props.chartHeight}}
    theme={props.theme}
  />


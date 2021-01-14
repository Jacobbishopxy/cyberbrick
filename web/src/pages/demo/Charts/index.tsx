/**
 * Created by Jacob Xie on 10/16/2020.
 */

import React, {useState, useRef, useLayoutEffect} from 'react'
import {PageContainer} from "@ant-design/pro-layout"
import {EChartOption} from "echarts"
import ReactEcharts from "echarts-for-react"
import "@/components/EchartsPro/themes/macarons"


const data = [
  {time: '2017', 'alpha': 43.3, 'beta': 85.8, 'trend': 93.7},
  {time: '2018', 'alpha': 83.1, 'beta': 73.4, 'trend': 55.1},
  {time: '2019', 'alpha': 86.4, 'beta': 65.2, 'trend': 82.5},
  {time: '2020', 'alpha': 72.4, 'beta': 53.9, 'trend': 39.1}
]

const chartOption: EChartOption = {
  tooltip: {},
  legend: {
    data: ['alpha', 'beta', 'trend']
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
      name: "Bar",
      position: "left",
    },
    {
      type: "value",
      name: "Line",
      position: "right",
      splitLine: {show: false}
    },
  ],
  series: [
    {
      type: 'bar',
      yAxisIndex: 0,
      name: "alpha",
      encode: {
        x: "time",
        y: "alpha",
        tooltip: ["alpha"]
      }
    },
    {
      type: 'bar',
      yAxisIndex: 0,
      name: "beta",
      encode: {
        x: "time",
        y: "beta",
        tooltip: ["beta"]
      }
    },
    {
      type: 'line',
      yAxisIndex: 1,
      name: 'trend',
      encode: {
        x: "time",
        y: "trend",
        tooltip: ["trend"],
      }
    }
  ]
}

export default () => {
  const chartRef = useRef<HTMLDivElement>(null)

  const [chartHeight, setChartHeight] = useState<number>(0)

  useLayoutEffect(() => {
    if (chartRef.current) setChartHeight(chartRef.current.offsetHeight)
  })

  return (
    <PageContainer>
      <div style={{height: "85vh"}} ref={chartRef}>
        <ReactEcharts
          option={chartOption}
          opts={{height: chartHeight}}
          theme="macarons"
        />
      </div>
    </PageContainer>
  )
}


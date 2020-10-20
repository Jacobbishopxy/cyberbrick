/**
 * Created by Jacob Xie on 10/16/2020.
 */

import React, { useState, useRef, useLayoutEffect } from 'react'
import { PageContainer } from "@ant-design/pro-layout"
import { EChartOption } from "echarts"
import ReactEcharts from "echarts-for-react"


const data = [
  ['product', '2012', '2013', '2014', '2015'],
  ['alpha', 41.1, 30.4, 65.1, 53.3],
  ['beta', 86.5, 92.1, 85.7, 83.1],
  ['trend', 24.1, 67.2, 79.5, 86.4]
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
    { type: 'category' },
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
      splitLine: { show: false }
    },
  ],
  series: [
    {
      type: 'bar',
      seriesLayoutBy: 'row',
      yAxisIndex: 0,
      name: "alpha",
      encode: {
        x: "product",
        y: "alpha",
        tooltip: ["product", "alpha"]
      }
    },
    {
      type: 'bar',
      seriesLayoutBy: 'row',
      yAxisIndex: 0,
      name: "beta",
      encode: {
        x: "product",
        y: "beta",
        tooltip: ["product", "beta"]
      }
    },
    {
      type: 'line',
      seriesLayoutBy: "row",
      yAxisIndex: 1,
      name: 'trend',
      encode: {
        x: "product",
        y: "trend",
        tooltip: ["product", "trend"],
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
      <div style={ { height: "85vh" } } ref={ chartRef }>
        <ReactEcharts option={ chartOption } opts={ { height: chartHeight } }/>
      </div>
    </PageContainer>
  )
}


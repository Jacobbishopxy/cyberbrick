/**
 * Created by Jacob Xie on 10/16/2020.
 */

import React, { useState, useRef, useLayoutEffect } from 'react'
import { PageContainer } from "@ant-design/pro-layout"
import { EChartOption } from "echarts"
import ReactEcharts from "echarts-for-react"


const data = [
  ["year", 2015, 2016, 2017, 2018, 2019, 2020, 2021],
  ["income", 2014.71, 2090.25, 2208.97, 2485.55, 2697.03, 2946.574091, 3302.282939],
  ["profit", 1367.29, 1345.95, 1448.52, 1603.84, 1730.9, 1905.278991, 2144.523651],
]

const chartOption: EChartOption = {
  title: { text: "Profit" },
  tooltip: {},
  legend: {},
  dataset: [
    {
      source: data
    }
  ],
  xAxis: {
    type: "category"
  },
  yAxis: {},
  series: [
    { type: "line", smooth: true, seriesLayoutBy: "row" },
    { type: "line", smooth: true, seriesLayoutBy: "row" },
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


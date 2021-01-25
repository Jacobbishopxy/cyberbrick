/**
 * Created by Jacob Xie on 10/16/2020.
 */

import React, {useState, useRef, useLayoutEffect} from 'react'
import {PageContainer} from "@ant-design/pro-layout"
import {EChartOption} from "echarts"
import ReactEcharts from "echarts-for-react"
import "@/components/EchartsPro/themes/macarons"


const data = [
  {time: '2008', 'trick': .3, 'alpha': 59.4, 'beta': 67.8, 'trend1': 53.4, 'area1': 10, 'trend2': 13.4, 'area2': 9},
  {time: '2009', 'trick': .2, 'alpha': 68.9, 'beta': 59.9, 'trend1': 52.1, 'area1': 20, 'trend2': 22.1, 'area2': 11},
  {time: '2010', 'trick': .1, 'alpha': 71.1, 'beta': 79.6, 'trend1': 49.2, 'area1': 40, 'trend2': 39.2, 'area2': 22},
  {time: '2011', 'trick': .1, 'alpha': 62.1, 'beta': 73.3, 'trend1': 59.6, 'area1': 20, 'trend2': 49.6, 'area2': 25},
  {time: '2012', 'trick': .4, 'alpha': 60.5, 'beta': 75.6, 'trend1': 56.5, 'area1': 90, 'trend2': 26.5, 'area2': 45},
  {time: '2013', 'trick': .5, 'alpha': 55.3, 'beta': 79.5, 'trend1': 58.8, 'area1': 60, 'trend2': 18.8, 'area2': 23},
  {time: '2014', 'trick': .3, 'alpha': 58.1, 'beta': 82.2, 'trend1': 63.2, 'area1': 30, 'trend2': 33.2, 'area2': 54},
  {time: '2015', 'trick': .7, 'alpha': 62.4, 'beta': 85.4, 'trend1': 62.5, 'area1': 20, 'trend2': 42.5, 'area2': 38},
  {time: '2016', 'trick': .8, 'alpha': 61.8, 'beta': 81.2, 'trend1': 53.2, 'area1': 10, 'trend2': 23.2, 'area2': 48},
  {time: '2017', 'trick': .9, 'alpha': 43.3, 'beta': 77.8, 'trend1': 58.7, 'area1': 80, 'trend2': 18.7, 'area2': 29},
  {time: '2018', 'trick': .8, 'alpha': 83.1, 'beta': 73.4, 'trend1': 55.1, 'area1': 20, 'trend2': 35.1, 'area2': 12},
  {time: '2019', 'trick': .6, 'alpha': 86.4, 'beta': 65.2, 'trend1': 82.5, 'area1': 50, 'trend2': 22.5, 'area2': 19},
  {time: '2020', 'trick': .3, 'alpha': 72.4, 'beta': 53.9, 'trend1': 39.1, 'area1': 10, 'trend2': 19.1, 'area2': 8},
]

/**
 * multi y-axes line & scatter mixin plot
 */
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
        tooltip: ["alpha", "beta"]
      },
      symbolSize: (data: Record<string, number>) => data["beta"]
    },
    {
      type: 'scatter',
      yAxisIndex: 1,
      name: "trend1",
      encode: {
        x: "time",
        y: "trend1",
        tooltip: ["trend1", "area1"]
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
        tooltip: ["trend2", "area2"]
      },
      symbolSize: (data: Record<string, number>) => data["area2"]
    },

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
      <div style={{height: "80vh"}} ref={chartRef}>
        <ReactEcharts
          option={chartOption}
          opts={{height: chartHeight}}
          theme="macarons"
        />
      </div>
    </PageContainer>
  )
}


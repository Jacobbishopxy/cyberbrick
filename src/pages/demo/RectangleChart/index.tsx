/**
 * Created by Jacob Xie on 9/10/2020.
 */

import { PageContainer } from '@ant-design/pro-layout'
import React, { useState, useRef, useLayoutEffect } from 'react'
import { EChartOption } from "echarts"
import ReactEcharts from "echarts-for-react"


const data = [
  ["a", "b", "c", "d", "e"],
  ["No.10", 16, "No.16", 3, 'A'],
  ["No.18", 26, "No.32", 5, 'B'],
  ["No.26", 56, "No.35", 3, 'C'],
  ["No.32", 43, "No.56", 8, 'D'],
  ["No.58", 35, "No.70", 1, 'E'],
]

const dataStyles = [
  "red",
  "blue",
  "green",
  "cyan",
  "orange",
]

const xAxisData = [
  "No.10",
  "No.16",
  "No.18",
  "No.26",
  "No.32",
  "No.35",
  "No.56",
  "No.58",
  "No.70"
]

function rI(params: any, api: any) {
  const start = api.coord([api.value(0), api.value(1)])
  const end = api.coord([api.value(2)])
  const size = api.size([api.value(1), api.value(3)])

  console.log(start[0])

  return {
    type: 'rect',
    shape: {
      x: start[0],
      y: start[1],
      width: end[0] - start[0],
      height: size[0] - size[1]
    },
    style: api.style({stroke: dataStyles[params.dataIndex]})
  }
}

const chartOption: EChartOption = {
  title: {
    text: 'Profit',
    left: 'left'
  },
  tooltip: {},
  legend: {},
  dataset: [
    {
      source: data
    }
  ],
  xAxis: {
    scale: true,
    type: "category",
    data: xAxisData
  },
  yAxis: {},
  series: [
    {
      datasetIndex: 0,
      name: "custom",
      type: 'custom',
      // @ts-ignore
      renderItem: rI,
      label: {
        show: true,
        position: 'top'
      },
      dimensions: ['a', 'b', 'c', 'd', 'e'],
      encode: {
        x: "a",
        y: "b",
        width: "c",
        height: "d",
      },
      itemStyle: {
        color: "transparent",
        borderColor: "blue",
        borderWidth: 2
      }
    }
  ]
}

export default () => {
  const chartRef = useRef<HTMLDivElement>(null)

  const [chartHeight, setChartHeight] = useState<number>(0)

  useLayoutEffect(() => {
    if (chartRef.current) {
      setChartHeight(chartRef.current.offsetHeight)
    }
  }, [])

  return (
    <PageContainer>
      <div style={ { height: "85vh" } } ref={ chartRef }>
        <ReactEcharts
          option={ chartOption }
          opts={ { height: chartHeight } }
        />
      </div>
    </PageContainer>
  )
};

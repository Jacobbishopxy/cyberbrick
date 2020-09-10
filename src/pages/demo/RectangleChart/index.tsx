/**
 * Created by Jacob Xie on 9/10/2020.
 */

import { PageContainer } from '@ant-design/pro-layout'
import React, { useState, useRef, useLayoutEffect } from 'react'
import { EChartOption } from "echarts"
import ReactEcharts from "echarts-for-react"


const data = [
  ["a", "b", "c", "d", "e"],
  [10, 16, 3, 5, 'A'],
  [16, 18, 4, 3, 'B'],
  [18, 26, 5, 4, 'C'],
  [26, 32, 6, 7, 'D'],
  [32, 56, 3, 5, 'E'],
  [56, 62, 2, 2, 'F'],
  [58, 55, 1, 4, 'G'],
]

function rI(params: object, api: any) {
  const start = api.coord([api.value(0), api.value(1)])
  const end = api.size([api.value(2), api.value(3)])

  return {
    type: 'rect',
    shape: {
      x: start[0],
      y: start[1],
      width: end[0],
      height: end[1]
    },
    style: api.style()
  }
}


export default () => {
  const chartRef = useRef<HTMLDivElement>(null)

  const [chartHeight, setChartHeight] = useState<number>(0)

  useLayoutEffect(() => {
    if (chartRef.current) {
      setChartHeight(chartRef.current.offsetHeight)
    }
  }, [])


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
      scale: true
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

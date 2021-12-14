

import { EChartOption } from "echarts"
import ReactEcharts from "echarts-for-react"

import { data } from "./mock/ls"
import { ChartsProps } from "./data"


export default (props: ChartsProps) => {

  const chartOption = {
    "tooltip": {},
    "legend": {
      "data": [
        "数值1",
        "数值2"
      ]
    },
    "dataset": [
      {
        "source": [
          {
            "名称": "Search Engine",
            "数值1": "1048",
            "数值2": "500"
          },
          {
            "名称": "Direct",
            "数值1": "735",
            "数值2": "600"
          },
          {
            "名称": "Emai",
            "数值1": "480",
            "数值2": "700"
          },
          {
            "名称": "Union Ads",
            "数值1": "484",
            "数值2": "800"
          },
          {
            "名称": "Video Ads",
            "数值1": "300",
            "数值2": "900"
          }
        ]
      }
    ],
    "yAxis": [
      {
        "type": "category",
        "nameLocation": "middle",
        "nameGap": 20,
        "axisLabel": {
          "interval": 0,
          "rotate": 45
        }
      }
    ],
    "xAxis": [
      {
        type: "value",
        "position": "left",
        "splitLine": {
          "show": true
        },
        "offset": 0
      }
    ],
    "series": [
      {
        "yAxisIndex": 0,
        "name": "数值1",
        "encode": {
          "y": {
            "column": "名称",
            "type": "category"
          },
          "x": "数值1",
          "tooltip": [
            {
              "column": "名称",
              "type": "category"
            },
            "数值1"
          ]
        },
        "type": "bar"
      },
      {
        "yAxisIndex": 0,
        "name": "数值2",
        "encode": {
          "y": {
            "column": "名称",
            "type": "category"
          },
          "x": "数值2",
          "tooltip": [
            {
              "column": "名称",
              "type": "category"
            },
            "数值2"
          ]
        },
        "type": "bar"
      }
    ]
  }


  return (
    <ReactEcharts
      option={chartOption}
      opts={{ height: props.chartHeight }}
      theme={props.theme}
    />

  )
}

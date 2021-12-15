

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
    "xAxis": [
      {
        "position": "top",
        "splitLine": {
          "show": true
        },
        "offset": 0,
        "type": "value"
      },
      {
        "position": "bottom",
        "splitLine": {
          "show": false
        },
        "offset": 0,
        "type": "value"
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
    "series": [
      {
        "xAxisIndex": 0,
        "name": "数值1",
        "encode": {
          "x": "数值1",
          "y": {
            "column": "名称",
            "type": "category"
          },
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
        "xAxisIndex": 1,
        "name": "数值2",
        "encode": {
          "x": "数值2",
          "y": {
            "column": "名称",
            "type": "category"
          },
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

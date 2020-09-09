import { PageContainer } from '@ant-design/pro-layout'
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { Button, Select, Space } from 'antd'
import ReactEcharts from "echarts-for-react"
import { EChartOption } from "echarts"

import { getAllTickers, getRkx } from "@/services/kChart"


const chartOptions = (data: any[]): EChartOption => ({
  dataset: {
    source: data
  },
  xAxis: { type: "category" },
  yAxis: {
    scale: true,
    splitArea: {
      show: true
    }
  },
  series: [
    {
      name: "candlestick",
      type: "candlestick",
      encode: {
        x: "date",
        y: ["open", "close", "low", "high"]
      }
    }
  ]
})


export default () => {
  const chartRef = useRef<HTMLDivElement>(null)

  const [chartHeight, setChartHeight] = useState<number>(0)
  const [tickers, setTickers] = useState<string[]>([])
  const [selected, setSelected] = useState<string>()
  const [reloadTickers, setReloadTickers] = useState<number>(0)
  const [rkx, setRkx] = useState<any[]>()

  useLayoutEffect(() => {
    if (chartRef.current) {
      setChartHeight(chartRef.current.offsetHeight)
    }
  }, [])

  useEffect(() => {
    getAllTickers().then(res => setTickers(res))
  }, [reloadTickers])

  useEffect(() => {
    if (selected) {
      getRkx(selected).then(res => setRkx(res))
    }
  }, [selected])

  return (
    <PageContainer>
      <Space>
        <Select style={ { width: 120 } } onChange={ (v: string) => setSelected(v) }>
          {
            tickers.map(t => (
              <Select.Option key={ t } value={ t }>
                { t }
              </Select.Option>
            ))
          }
        </Select>
        <Button
          type="primary"
          onClick={ () => setReloadTickers(reloadTickers + 1) }
        >
          Reload
        </Button>
      </Space>
      <div style={ { height: "70vh" } } ref={ chartRef }>
        {
          rkx ?
            <ReactEcharts
              option={ chartOptions(rkx) }
              opts={ { height: chartHeight } }
            /> : <div/>
        }
      </div>
    </PageContainer>
  )
};

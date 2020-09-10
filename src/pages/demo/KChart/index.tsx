import { PageContainer } from '@ant-design/pro-layout'
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { Button, Select, Space, Spin } from 'antd'
import ReactEcharts from "echarts-for-react"
import { EChartOption } from "echarts"

import { getAllTickers, getBi, getDn, getRkx } from "@/services/kChart"


interface ChartSource {
  rkx?: any[]
  bi?: any[]
  dn?: any[]
}

const chartOptions = (source: ChartSource): EChartOption => ({
  dataset: [
    {
      source: source.rkx
    },
    {
      source: source.bi
    },
    {
      source: source.dn
    },
  ],
  xAxis: { type: "category" },
  yAxis: {
    scale: true,
    splitArea: {
      show: true
    }
  },
  dataZoom: [
    {
      type: 'inside',
      start: 95,
      end: 100
    },
    {
      show: true,
      type: 'slider',
      top: '95%',
      start: 95,
      end: 100
    }
  ],
  series: [
    {
      datasetIndex: 0,
      name: "candlestick",
      type: "candlestick",
      encode: {
        x: "date",
        y: ["open", "close", "low", "high"]
      }
    },
    {
      datasetIndex: 1,
      name: "bi",
      type: "line",
      encode: {
        x: "startDate",
        y: "low"
      },
      lineStyle: {
        color: "green"
      }
    },
    {
      datasetIndex: 2,
      name: "dn",
      type: "line",
      encode: {
        x: "startDate",
        y: "low"
      },
      lineStyle: {
        color: "cyan"
      }
    },
  ]
})


export default () => {
  const chartRef = useRef<HTMLDivElement>(null)

  const [chartHeight, setChartHeight] = useState<number>(0)
  const [tickers, setTickers] = useState<string[]>([])
  const [selected, setSelected] = useState<string>()
  const [reloadTickers, setReloadTickers] = useState<number>(0)
  const [data, setData] = useState<ChartSource>()
  const [loading, setLoading] = useState<boolean>(false)

  useLayoutEffect(() => {
    if (chartRef.current) {
      setChartHeight(chartRef.current.offsetHeight)
    }
  }, [])

  useEffect(() => {
    getAllTickers().then(res => setTickers(res))
  }, [reloadTickers])

  useEffect(() => {
    setLoading(false)
  }, [data])

  const getAllData = async (ticker: string) => {
    setLoading(true)
    return Promise.all([
      getRkx(ticker),
      getBi(ticker),
      getDn(ticker),
    ])
  }

  useEffect(() => {
    if (selected) {
      getAllData(selected).then(res => {
        const [rkx, bi, dn] = res
        setData({
          rkx, bi, dn
        })
      })
    }
  }, [selected])

  const genChart = (d: ChartSource) =>
    <ReactEcharts
      option={ chartOptions(d) }
      opts={ { height: chartHeight } }
    />

  return (
    <PageContainer>
      <Space>
        <span style={ { fontWeight: "bold" } }>Ticker:</span>
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
          Tickers Reload
        </Button>
      </Space>
      <div
        style={ { height: "70vh" } }
        ref={ chartRef }
      >
        {
          data ?
            genChart(data) :
            <Spin
              style={ {
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: -50,
                marginLeft: -50,
                width: 100,
                height: 100
              } }
              size="large"
              spinning={ loading }
            />
        }
      </div>
    </PageContainer>
  )
};

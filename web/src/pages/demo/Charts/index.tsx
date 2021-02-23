/**
 * Created by Jacob Xie on 10/16/2020.
 */

import {useState, useRef, useLayoutEffect} from 'react'
import {Select, Tabs} from "antd"

import {themeSelections} from "@/components/EchartsPro/themeSelections"
import {LineScatter} from "./LineScatter"
import {Candlestick} from "./Candlestick"
import {Treemap} from "./Treemap"
import {Pie} from "./Pie"


export default () => {
  const chartRef = useRef<HTMLDivElement>(null)

  const [chartHeight, setChartHeight] = useState<number>(0)
  const [theme, setTheme] = useState<string>("default")

  useLayoutEffect(() => {
    if (chartRef.current) setChartHeight(chartRef.current.offsetHeight)
  })

  return (
    <div style={{height: "90vh"}} ref={chartRef}>
      <Tabs
        tabBarExtraContent={{
          right: <Select
            onChange={(t: string) => setTheme(t)}
            style={{width: 250}}
          >
            {
              themeSelections.map(t =>
                <Select.Option key={t.name} value={t.name}>{t.ele}</Select.Option>
              )
            }
          </Select>
        }}
        style={{height: "100%"}}
        defaultActiveKey={"4"}
      >
        <Tabs.TabPane tab="Line & Scatter" key="1">
          <LineScatter chartHeight={chartHeight - 50} theme={theme} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Candlestick" key="2">
          <Candlestick chartHeight={chartHeight - 50} theme={theme} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Treemap" key="3">
          <Treemap chartHeight={chartHeight - 70} theme={theme} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Pie" key="4">
          <Pie chartHeight={chartHeight - 50} theme={theme} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}


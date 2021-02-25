/**
 * Created by Jacob Xie on 2/23/2021
 */

import {useState} from "react"
import {Radio, Space} from "antd"
import ReactEcharts from "echarts-for-react"
import _ from "lodash"

import {data} from "./mock/pie"
import {ChartsProps} from "./data"
import {generatePieOption} from "@/components/Gallery/Utils/chartGenerators"


const pieOpt = generatePieOption()
type Dir = "vertical" | "horizontal"

/**
 * multi-series pie
 */
export const Pie = (props: ChartsProps) => {

  const [dir, setDir] = useState<Dir>("vertical")

  const getOption = (v: Dir) =>
    pieOpt(data, {select: "year", seriesDir: v})

  return (
    <>
      <Space style={{backgroundColor: "lightgray", padding: 5}}>
        <div>Data direction: </div>
        <Radio.Group onChange={e => setDir(e.target.value)} value={dir}>
          <Radio value="vertical">Vertical</Radio>
          <Radio value="horizontal">Horizontal</Radio>
        </Radio.Group>
      </Space>
      <ReactEcharts
        option={getOption(dir)}
        opts={{height: props.chartHeight}}
        theme={props.theme}
        // IMPORTANT!
        notMerge={true}
      />
    </>
  )
}


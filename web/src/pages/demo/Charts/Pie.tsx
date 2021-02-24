/**
 * Created by Jacob Xie on 2/23/2021
 */

import ReactEcharts from "echarts-for-react"
import _ from "lodash"

import {data} from "./mock/pie"
import {ChartsProps} from "./data"
import {generatePieOption} from "@/components/Gallery/ModulePanel/Collections/graph/utils/chartGenerators"



/**
 * multi-series pie
 */
export const Pie = (props: ChartsProps) => {

  const o = generatePieOption()(data, {select: "year", seriesDir: "horizontal"})

  return (
    <ReactEcharts
      option={o}
      opts={{height: props.chartHeight}}
      theme={props.theme}
    />
  )
}


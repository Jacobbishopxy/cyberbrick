/**
 * Created by Jacob Xie on 10/16/2020.
 */

import React, { useLayoutEffect, useRef, useState } from 'react'
import { Button } from "antd"
import { EChartOption } from "echarts"
import ReactEcharts from "echarts-for-react"

import { FileUploadModal } from "@/components/FileUploadModal"

import { ModuleGenerator } from "../Generator/ModuleGenerator"
import { ModuleEditorField, ModulePresenterField } from "../Generator/data"
import * as DataType from "../../GalleryDataType"


const postingUrl = "/api/fm/extractXlsxFile"

const EditorField = (props: ModuleEditorField) => {
  const [visible, setVisible] = useState<boolean>(false)
  const [content, setContent] = useState<DataType.Content | undefined>(props.content)

  const saveContent = (d: object[]) => {
    const ctt = content ? {
      ...content,
      data: { data: d }
    } : {
      date: DataType.today(),
      data: { data: d }
    }
    console.log("saving", ctt)
    setContent(ctt)
    props.updateContent(ctt)
  }

  return (
    <div className={ props.styling }>
      <Button
        type='primary'
        shape='round'
        size='small'
        onClick={ () => setVisible(true) }
        style={ { position: "relative", top: "40%" } }
      >
        Click here to modify
      </Button>
      <FileUploadModal
        postingUrl={ postingUrl }
        setVisible={ setVisible }
        visible={ visible }
        upload={ saveContent }
      />
    </div>
  )
}

interface SheetType {
  name: string
  data: object[]
}

const PresenterField = (props: ModulePresenterField) => {
  const chartRef = useRef<HTMLDivElement>(null)

  const [chartHeight, setChartHeight] = useState<number>(0)

  useLayoutEffect(() => {
    if (chartRef.current) setChartHeight(chartRef.current.offsetHeight)
  })

  const genChartOption = (data: SheetType[]): EChartOption => {
    const d = data.map(i => i.data)[0]
    return {
      title: { text: "Profit" },
      tooltip: {},
      legend: {},
      dataset: [{ source: d }],
      xAxis: {
        type: "category"
      },
      yAxis: {},
      series: [
        { type: "line", smooth: true, seriesLayoutBy: "row" },
        { type: "line", smooth: true, seriesLayoutBy: "row" },
      ]
    }
  }

  // todo: `style={ { height: "50vh" } }` needs to get height from `TemplateElement` then pass it to `ModulePanel`
  return props.content && props.content.data.data ?
    <div style={ { height: "50vh" } } ref={ chartRef }>
      <ReactEcharts option={ genChartOption(props.content.data.data) } opts={ { height: chartHeight } }/>
    </div> : <></>
}

export const Line = new ModuleGenerator(EditorField, PresenterField).generate()


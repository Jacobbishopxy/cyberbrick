/**
 * Created by Jacob Xie on 10/16/2020.
 */

import React, { useState } from 'react'
import { Button, Radio, Space } from "antd"
import { EChartOption } from "echarts"
import ReactEcharts from "echarts-for-react"
import _ from "lodash"

import { FileUploadModal } from "@/components/FileUploadModal"

import { ModuleGenerator } from "../Generator/ModuleGenerator"
import { ModuleEditorField, ModulePresenterField } from "../Generator/data"
import * as DataType from "../../GalleryDataType"


const postingUrl = "/api/fm/extractXlsxFile"

interface ContentCfg {
  dataIndexDir: "vertical" | "horizontal"
}

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
    setContent(ctt)
    props.updateContent(ctt)
  }

  const saveContentConfig = (dataIndexDir: string) => {
    const ctt = content ? {
      ...content,
      config: { dataIndexDir }
    } : {
      date: DataType.today(),
      data: { data: [] },
      config: { dataIndexDir }
    }
    setContent(ctt)
  }

  return (
    <div className={ props.styling }>
      <Space
        direction="vertical"
        style={ { position: "relative", top: "40%" } }
      >
        <Button
          type='primary'
          shape='round'
          size='small'
          onClick={ () => setVisible(true) }
        >
          Click here to modify
        </Button>
        <Space>
          Index direction:
          <Radio.Group
            onChange={ e => saveContentConfig(e.target.value) }
            defaultValue="horizontal"
          >
            <Radio value="horizontal">Horizontal</Radio>
            <Radio value="vertical">Vertical</Radio>
          </Radio.Group>
        </Space>
      </Space>

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
  data: [][]
}

/**
 * default direction: horizontal
 */
const genSeries = (data: [][], direction?: "vertical" | "horizontal") => {
  if (direction === "vertical")
    return _.range(data[0].length - 1).map(() => ({
      type: "line",
      smooth: true,
    }))
  return _.range(data.length - 1).map(() => ({
    type: "line",
    smooth: true,
    seriesLayoutBy: "row"
  }))
}

const genChartOption = (data: [][], cfg?: ContentCfg): EChartOption => {

  return {
    title: { text: "Profit" },
    tooltip: {},
    legend: {},
    dataset: [{ source: data }],
    xAxis: {
      type: "category"
    },
    yAxis: {},
    series: genSeries(data, cfg?.dataIndexDir)
  }
}

const PresenterField = (props: ModulePresenterField) => {
  if (props.content && props.content.data.data) {
    const d: SheetType[] = props.content.data.data
    const data = d.map(i => i.data)[0]
    const c = props.content.config ? props.content.config as ContentCfg : undefined

    return <ReactEcharts
      option={ genChartOption(data, c) }
      style={ { height: props.contentHeight } }
    />
  }
  return <></>
}

export const Line = new ModuleGenerator(EditorField, PresenterField).generate()


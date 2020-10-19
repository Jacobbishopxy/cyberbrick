/**
 * Created by Jacob Xie on 10/16/2020.
 */

import React, { useEffect, useState } from 'react'
import { Button, message, Radio, Space } from "antd"
import ReactEcharts from "echarts-for-react"

import { FileUploadModal, SheetStyle } from "@/components/FileUploadModal"

import { ModuleGenerator } from "../Generator/ModuleGenerator"
import { ModuleEditorField, ModulePresenterField } from "../Generator/data"
import * as DataType from "../../GalleryDataType"
import { genLineChartOption } from "./chartUtils"


const postingUrl = "/api/fm/extractXlsxFile"

const EditorField = (props: ModuleEditorField) => {
  const [visible, setVisible] = useState<boolean>(false)
  const [content, setContent] = useState<DataType.Content | undefined>(props.content)
  const [savingDisable, setSavingDisable] = useState<boolean>(true)

  useEffect(() => {
    if (content && content.data && content.config) setSavingDisable(false)
  }, [content])

  const saveContentData = (d: SheetStyle[]) => {
    const dataSource = d.map(i => i.data)[0]
    const ctt = content ? {
      ...content,
      data: { data: dataSource }
    } : {
      date: DataType.today(),
      data: { data: dataSource }
    }
    setContent(ctt)
  }

  const saveContentConfig = (dataIndexDir: string) => {
    const ctt = content ? {
      ...content,
      config: { dataIndexDir }
    } : {
      date: DataType.today(),
      config: { dataIndexDir }
    }
    setContent(ctt as DataType.Content)
  }

  const saveContent = () => {
    if (content && content.data && content.config) {
      props.updateContent(content)
      message.success("Saving succeeded!")
    } else {
      message.warn("Saving failed! File and options are required!")
    }
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
          Click here to upload file
        </Button>
        <Space>
          Index direction:
          <Radio.Group
            onChange={ e => saveContentConfig(e.target.value) }
            defaultValue={ props.content?.config?.dataIndexDir }
          >
            <Radio value="horizontal">Horizontal</Radio>
            <Radio value="vertical">Vertical</Radio>
          </Radio.Group>
        </Space>
        <Button
          type='primary'
          size='small'
          onClick={ saveContent }
          disabled={ savingDisable }
        >
          Save
        </Button>
      </Space>

      <FileUploadModal
        postingUrl={ postingUrl }
        setVisible={ setVisible }
        visible={ visible }
        upload={ saveContentData }
        multiSheetDisable
      />
    </div>
  )
}

const PresenterField = (props: ModulePresenterField) => {
  if (props.content && props.content.data.data)
    return <ReactEcharts
      option={ genLineChartOption(props.content) }
      style={ { height: props.contentHeight } }
    />
  return <></>
}

export const Line = new ModuleGenerator(EditorField, PresenterField).generate()


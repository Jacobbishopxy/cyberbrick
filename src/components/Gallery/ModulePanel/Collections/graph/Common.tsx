/**
 * Created by Jacob Xie on 10/19/2020.
 */

import React, { useState } from 'react'
import { Button, Checkbox, message, Radio, Space } from "antd"
import ReactEcharts from "echarts-for-react"
import { EChartOption } from "echarts"
import _ from "lodash"

import { FileUploadModal, SheetStyle } from "@/components/FileUploadModal"

import { ModuleEditorField, ModulePresenterField } from "../../Generator/data"
import * as DataType from "../../../GalleryDataType"

const postingUrl = "/api/fm/extractXlsxFile"

type DataIndexDirection = "vertical" | "horizontal"

const stringifyDataHeader = (data: any[][]) =>
  _.concat([data[0].map((i: any) => i.toString())], data.slice(1))
const stringifyDataIndex = (data: any[][]) =>
  data.map((arr: any[]) => _.concat(arr[0].toString(), arr.slice(1)))

const convertChartData = (data: any[][], dataIndexDirection: DataIndexDirection): [any[][], string[]] => {

  let cData
  let fields
  if (dataIndexDirection === "vertical") {
    const d = stringifyDataHeader(data)
    cData = stringifyDataHeader(_.zip(...d))
    fields = cData[0].slice(1)
  } else {
    const d = stringifyDataHeader(data)
    cData = stringifyDataIndex(d)
    fields = cData.map((a: string[]) => a[0])
  }

  return [cData, fields]
}

interface SavingProcess {
  dataIndexDir: boolean
  data: boolean
  lineArr: boolean
}

export const generateCommonEditorField = (mixin: boolean = false) =>
  (props: ModuleEditorField) => {
    const [visible, setVisible] = useState<boolean>(false)
    const [content, setContent] = useState<DataType.Content | undefined>(props.content)
    const [selectableFields, setSelectableFields] = useState<string[]>([])
    const [savingProcess, setSavingProcess] = useState<SavingProcess>({
      dataIndexDir: false,
      data: false,
      lineArr: false
    })

    // 1. set data index direction
    const saveContentConfig = (dataIndexDir: string) => {
      const ctt = {
        ...content!,
        date: DataType.today(),
        config: { dataIndexDir }
      }
      setContent(ctt)
      setSavingProcess({ ...savingProcess, dataIndexDir: true })
    }

    // 2. set data
    const saveContentData = (d: SheetStyle[]) => {
      const [dataSource, fields] = convertChartData(d.map(i => i.data)[0], content!.config!.dataIndexDir)

      const ctt = {
        ...content!,
        data: { data: dataSource },
        config: { ...content!.config }
      }
      setContent(ctt)
      setSelectableFields(fields)
      setSavingProcess({ ...savingProcess, data: true })
    }

    // 3. set lines (required if mixin is true)
    const saveContentConfigLineArr = (lineArr: string[]) => {
      const ctt = {
        ...content,
        config: { ...content!.config, lineArr }
      }
      setContent(ctt as DataType.Content)
      setSavingProcess({ ...savingProcess, lineArr: true })
    }

    const genCheckBox = () => {
      if (mixin && content && savingProcess.data) {
        return (
          <Space direction="vertical">
            Select fields as line in chart:
            <Checkbox.Group
              style={ { width: "100%" } }
              onChange={ vs => saveContentConfigLineArr(vs as string[]) }
              disabled={ !savingProcess.data }
            >
              {
                selectableFields.map((n: string) =>
                  <Checkbox value={ n }>{ n }</Checkbox>
                )
              }
            </Checkbox.Group>
          </Space>
        )
      }
      return <></>
    }

    const saveContent = () => {
      if (content) {
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
            shape='round'
            size='small'
            disabled={ !savingProcess.dataIndexDir }
            onClick={ () => setVisible(true) }
          >
            Click here to upload file
          </Button>
          { genCheckBox() }
          <Button
            type='primary'
            size='small'
            onClick={ saveContent }
            disabled={ mixin ? !savingProcess.lineArr : !savingProcess.data }
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

export const generateCommonPresenterField = (chartOptionGenerator: (v: DataType.Content) => EChartOption) =>
  (props: ModulePresenterField) => {
    if (props.content && props.content.data)
      return <ReactEcharts
        option={ chartOptionGenerator(props.content) }
        style={ { height: props.contentHeight } }
      />
    return <></>
  }

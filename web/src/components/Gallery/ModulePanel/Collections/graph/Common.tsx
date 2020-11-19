/**
 * Created by Jacob Xie on 10/19/2020.
 */

import React, {useEffect, useState} from 'react'
import {Button, Checkbox, message, Radio, Space} from "antd"
import ReactEcharts from "echarts-for-react"
import {EChartOption} from "echarts"
import _ from "lodash"

import {FileUploadModal} from "@/components/FileUploadModal"
import {Emoji} from "@/components/Emoji"

import {ModuleEditorField, ModulePresenterField} from "../../Generator/data"
import * as DataType from "../../../GalleryDataType"

const postingUrl = "/api/upload/extract"

type DataIndexDirection = "vertical" | "horizontal"

const stringifyDataHeader = (data: any[][]) =>
  _.concat([data[0].map((i: any) => i.toString())], data.slice(1))
const stringifyDataIndex = (data: any[][]) =>
  data.map((arr: any[]) => _.concat(arr[0].toString(), arr.slice(1)))
const checkUniqueness = (data: any[]) =>
  _.uniq(data).length === data.length

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

export const generateCommonEditorField = (mixin: boolean = false) =>
  (props: ModuleEditorField) => {
    const [visible, setVisible] = useState<boolean>(false)
    const [content, setContent] = useState<DataType.Content | undefined>(props.content)
    const [selectableFields, setSelectableFields] = useState<string[]>([])
    const [savingProcessDataIndexDir, setSavingProcessDataIndexDir] = useState(false)
    const [savingProcessData, setSavingProcessData] = useState(false)
    const [savingProcessLineArr, setSavingProcessLineArr] = useState(false)

    useEffect(() => {
      if (content?.config?.dataIndexDir)
        setSavingProcessDataIndexDir(true)
      if (content?.data) {
        setSavingProcessData(true)
        setSelectableFields(content.data.data.slice(1).map((arr: any[]) => arr[0]))
      }
      if (content?.config?.lineArr)
        setSavingProcessLineArr(true)
    }, [content])

    // 1. set data index direction
    const saveContentConfig = (dataIndexDir: string) => {
      const ctt = {
        ...content!,
        date: DataType.today(),
        config: {dataIndexDir}
      }
      setContent(ctt)
    }

    // 2. set data
    const saveContentData = (d: any[]) => {
      const [dataSource, fields] = convertChartData(d.map(i => i.data)[0], content!.config!.dataIndexDir)

      if (checkUniqueness(fields)) {
        const ctt = {
          ...content!,
          data: {data: dataSource},
          config: {...content!.config}
        }
        setContent(ctt)
        setSelectableFields(fields)
      } else
        message.warn("Please confirm there is no duplicated fields in your file!")
    }

    // 3. set lines (required if mixin is true)
    const saveContentConfigLineArr = (lineArr: string[]) => {
      const ctt = {
        ...content,
        config: {...content!.config, lineArr}
      }
      setContent(ctt as DataType.Content)
    }

    const genCheckBox = () => {
      if (mixin && content && savingProcessData) {
        return (
          <Space direction="vertical">
            <Space>
              <Emoji label="0" symbol="③" size={20}/>
              Select fields as line in chart:
            </Space>
            <Checkbox.Group
              style={{width: "100%"}}
              onChange={vs => saveContentConfigLineArr(vs as string[])}
              disabled={!savingProcessData}
              defaultValue={content.config!.lineArr}
            >
              {
                selectableFields.map((n: string) =>
                  <Checkbox key={n} value={n}>{n}</Checkbox>
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
        message.success("Updating succeeded!")
      } else {
        message.warn("Updating failed! File and options are required!")
      }
    }

    return (
      <div className={props.styling}>
        <Space
          direction="vertical"
          style={{position: "relative", top: "30%"}}
        >
          <Space>
            <Emoji label="0" symbol="①" size={20}/>
            Index direction:
            <Radio.Group
              onChange={e => saveContentConfig(e.target.value)}
              defaultValue={props.content?.config?.dataIndexDir}
            >
              <Radio value="horizontal">Horizontal</Radio>
              <Radio value="vertical">Vertical</Radio>
            </Radio.Group>
          </Space>
          <Space>
            <Emoji label="0" symbol="②" size={20}/>
            <Button
              type='primary'
              shape='round'
              size='small'
              disabled={!savingProcessDataIndexDir}
              onClick={() => setVisible(true)}
            >
              Click here to upload file
            </Button>
          </Space>

          {genCheckBox()}
          <Button
            type='primary'
            size='small'
            onClick={saveContent}
            disabled={mixin ? !savingProcessLineArr : !savingProcessData}
          >
            Update
          </Button>
        </Space>

        <FileUploadModal
          postingUrl={postingUrl}
          setVisible={setVisible}
          visible={visible}
          upload={saveContentData}
          multiSheetDisable
        />
      </div>
    )
  }

export const generateCommonPresenterField = (chartOptionGenerator: (v: DataType.Content) => EChartOption) =>
  (props: ModulePresenterField) => {
    if (props.content && props.content.data)
      return <ReactEcharts
        option={chartOptionGenerator(props.content)}
        style={{height: props.contentHeight}}
      />
    return <></>
  }

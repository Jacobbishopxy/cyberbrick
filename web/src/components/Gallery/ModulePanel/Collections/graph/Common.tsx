/**
 * Created by Jacob Xie on 10/19/2020.
 */

import React, {useEffect, useState} from 'react'
import {Button, message, Space} from "antd"
import ReactEcharts from "echarts-for-react"
import {EChartOption} from "echarts"
import ProForm from "@ant-design/pro-form"

import {QuerySelectorModal} from "@/components/Gallery/Dataset"

import {ModuleEditorField, ModulePresenterField} from "../../Generator/data"
import * as DataType from "../../../GalleryDataType"
import {ChartConfig} from "./data"
import {AxisSelectorForm} from "./AxisSelectorForm"


export const generateCommonEditorField = (mixin: boolean = false) =>
  (props: ModuleEditorField) => {
    const [content, setContent] = useState<DataType.Content | undefined>(props.content)
    const [columns, setColumns] = useState<string[]>()
    const [defaultYColumns, setDefaultYColumns] = useState<string[]>([])

    const saveContentData = (data: Record<string, any>) => {
      const ctt = {
        ...content!,
        date: DataType.today(),
        data
      }
      setContent(ctt)
      setColumns(data.selects)

      return true
    }


    const saveContent = async (values: Record<string, any>) => {
      if (content) {
        const v = values as ChartConfig

        const baseY = [{position: "left", columns: defaultYColumns}]
        const y = v.y ? [...baseY, ...v.y] : baseY

        const config = {...v, y}
        const ctt = {...content, config}
        props.updateContent(ctt)
        message.success("Updating succeeded!")
      } else {
        message.warn("Updating failed! dataset and options are required!")
      }
    }

    return (
      <div style={{padding: 20}}>
        <Space style={{marginBottom: 8}}>
          Dataset
        </Space>
        <QuerySelectorModal
          trigger={
            <Button
              type='primary'
              style={{marginBottom: 20}}
            >
              Click here to select dataset
            </Button>
          }
          storagesOnFetch={props.fetchStorages!}
          storageOnSelect={props.fetchTableList!}
          tableOnSelect={props.fetchTableColumns!}
          onSubmit={saveContentData}
          columnsRequired
        />

        <ProForm
          name="Configuration"
          onFinish={saveContent}
          initialValues={{x: {type: "category"}}}
        >
          <AxisSelectorForm
            mixin={mixin}
            columns={columns}
            getYAxis={setDefaultYColumns}
          />
        </ProForm>
      </div>
    )
  }

export const generateCommonPresenterField =
  (chartOptionGenerator: (data: any[], config: ChartConfig) => EChartOption) =>
    (props: ModulePresenterField) => {

      const [data, setData] = useState<any[]>()

      useEffect(() => {
        if (props.fetchQueryData && props.content) {
          if (props.content.data)
            props.fetchQueryData(props.content).then(res => setData(res))
        }
      }, [props.content])


      if (data && props.content && props.content.config)
        return <ReactEcharts
          option={chartOptionGenerator(data, props.content.config as ChartConfig)}
          style={{height: props.contentHeight}}
        />
      return <></>
    }


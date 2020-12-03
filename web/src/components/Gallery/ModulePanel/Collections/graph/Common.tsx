/**
 * Created by Jacob Xie on 10/19/2020.
 */

import React, {useState} from 'react'
import {Button, message, Space} from "antd"
import ReactEcharts from "echarts-for-react"
import {EChartOption} from "echarts"
import ProForm from "@ant-design/pro-form"

import {QuerySelectorModal} from "@/components/Gallery/Dataset"

import {ModuleEditorField, ModulePresenterField} from "../../Generator/data"
import * as DataType from "../../../GalleryDataType"
import {AxisSelectorForm} from "./AxisSelectorForm"


export const generateCommonEditorField = (mixin: boolean = false) =>
  (props: ModuleEditorField) => {
    const [content, setContent] = useState<DataType.Content | undefined>(props.content)
    const [columns, setColumns] = useState<string[]>()

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
        const ctt = {
          ...content,
          config: values
        }
        props.updateContent(ctt)
        message.success("Updating succeeded!")
      } else {
        message.warn("Updating failed! dataset and options are required!")
      }
    }

    return (
      <>
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
        >
          <AxisSelectorForm
            mixin={mixin}
            columns={columns}
          />
        </ProForm>
      </>
    )
  }

export const generateCommonPresenterField = (chartOptionGenerator: (v: DataType.Content) => EChartOption) =>
  (props: ModulePresenterField) => {

    // todo: query data
    // props.fetchQueryData

    if (props.content && props.content.data)
      return <ReactEcharts
        option={chartOptionGenerator(props.content)}
        style={{height: props.contentHeight}}
      />
    return <></>
  }

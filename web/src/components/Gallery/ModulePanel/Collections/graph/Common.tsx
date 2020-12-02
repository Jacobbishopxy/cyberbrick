/**
 * Created by Jacob Xie on 10/19/2020.
 */

import React, {useState} from 'react'
import {Button, message} from "antd"
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
        // props.updateContent(content)
        console.log("saveContent data: ", content)
        console.log("saveContent config: ", values)
        message.success("Updating succeeded!")
      } else {
        message.warn("Updating failed! File and options are required!")
      }
    }

    const genConfigs = () =>
      columns ?
        <AxisSelectorForm
          mixin={mixin}
          columns={columns}
        /> : <></>


    return (
      <>
        <QuerySelectorModal
          trigger={
            <Button
              type='primary'
              shape='round'
              size='small'
            >
              Click here to select dataset
            </Button>
          }
          storagesOnFetch={props.fetchStorages!}
          storageOnSelect={props.fetchTableList!}
          tableOnSelect={props.fetchTableColumns!}
          onSubmit={saveContentData}
        />

        <ProForm
          name="Configuration"
          onFinish={saveContent}
        >
          {genConfigs()}
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

/**
 * Created by Jacob Xie on 12/23/2020
 */

import React, {useEffect, useState} from 'react'
import {Table} from "antd"
import {ColumnsType} from "antd/lib/table/interface"
import {HotTable} from "@handsontable/react"
import _ from "lodash"
import moment from "moment"

import * as DataType from "../../../GalleryDataType"
import {ModuleGenerator} from "../../Generator/ModuleGenerator"
import {ModulePresenterField} from "../../Generator/data"
import {DisplayType, GeneralTableConfigInterface, GeneralTableEditorField} from "./GeneralTableEditorField"
import {genHotTableProps} from "./XlsxTable"

import "handsontable/dist/handsontable.full.css"


const setColumnsAndTransformData = (data: Record<string, any>[],
                                    config: GeneralTableConfigInterface): [ColumnsType<any>, Record<string, any>[]] => {
  const col = _.keys(data[0]).map((k: string) => ({
    key: k,
    title: k,
    dataIndex: k
  }))
  const display = _.reduce(config.display, (acc: Record<string, any>, v: DisplayType) => ({
    ...acc, [v.column]: v.type
  }), {})

  const d = data.map((i, idx) => {
    const trans = _.transform(i, (r: Record<string, any>, v: any, k: string) => {
      if (display[k] === "date")
        r[k] = moment(v).format("YYYY-MM-DD") || undefined
      else if (display[k] === "number")
        r[k] = (+v).toFixed(2) || undefined
      else if (display[k] === "percent")
        r[k] = `${(+v * 100).toFixed(2)} %` || undefined
      else
        r[k] = v
    })

    return {...trans, key: idx}
  })
  return [col, d]
}


interface FlexTableViewProps {
  content: DataType.Content
  fetchQueryData: (value: DataType.Content) => Promise<any>
  contentHeight?: number
}

const FlexTableView = (props: FlexTableViewProps) => {

  const [config, setConfig] = useState<GeneralTableConfigInterface>()

  const [columns, setColumns] = useState<ColumnsType<any>>([])
  const [data, setData] = useState<Record<string, any>[]>()


  const genColumnsAndData = (rawData: Record<string, any>[],
                             rawConfig: GeneralTableConfigInterface) => {

    console.log(0, rawData, rawConfig)

    if (rawData && rawConfig) {
      const [col, d] = setColumnsAndTransformData(rawData, rawConfig)

      console.log(1, col, d)

      setColumns(col)
      setData(d)
    }
  }

  useEffect(() => {
    const c = props.content.config as GeneralTableConfigInterface
    setConfig(c)
    if (c) {
      if (c.type === "dataset")
        props.fetchQueryData(props.content).then(res => genColumnsAndData(res, c))
      if (c.type === "file")
        genColumnsAndData(props.content.data[0], c)
    }
  }, [props.content])


  const defaultTable = () => <Table
    columns={columns}
    dataSource={data}
    showHeader={config!.view?.includes("header") || undefined}
    bordered={config!.view?.includes("border") || undefined}
    pagination={false}
  />

  const xlsxTable = () => <HotTable
    {...genHotTableProps(props.contentHeight, config?.view)}
    data={data}
  />

  switch (config?.type) {
    case "dataset":
      return defaultTable()
    case "file":
      return xlsxTable()
    default:
      return <></>
  }
}


export const PresenterField = (props: ModulePresenterField) => {

  return props.content ?
    <FlexTableView
      content={props.content}
      fetchQueryData={props.fetchQueryData!}
      contentHeight={props.contentHeight}
    /> : <></>
}

export const FlexTable = new ModuleGenerator(GeneralTableEditorField, PresenterField).generate()


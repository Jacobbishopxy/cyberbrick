/**
 * Created by Jacob Xie on 12/23/2020
 */

import React, {useEffect, useState} from 'react'
import {Table} from "antd"
import {ColumnsType} from "antd/lib/table/interface"
import {HotTable} from "@handsontable/react"
import _ from "lodash"

import * as DataType from "../../../GalleryDataType"
import {ModuleGenerator} from "../../Generator/ModuleGenerator"
import {ModulePresenterField} from "../../Generator/data"
import {GeneralTableConfigInterface, GeneralTableEditorField} from "./GeneralTableEditorField"
import {genHotTableProps} from "./XlsxTable"

import "handsontable/dist/handsontable.full.css"

interface FlexTableViewProps {
  content: DataType.Content
  fetchQueryData: (value: DataType.Content) => Promise<any>
  contentHeight? : number
}

const FlexTableView = (props: FlexTableViewProps) => {

  const [columns, setColumns] = useState<ColumnsType<any>>([])
  const [data, setData] = useState<any[]>([])
  const [config, setConfig] = useState<GeneralTableConfigInterface>()

  // todo: use config to reform data
  const setAll = (d: any[]) => {
    setColumns(_.keys(d[0]).map((k: string) => ({
      key: k,
      title: k,
      dataIndex: k
    })))
    setData(d.map((i, idx) => ({...i, key: idx})))
  }

  useEffect(() => {
    if (props.content.config) {
      setConfig(props.content.config as GeneralTableConfigInterface)
      if (props.content.config.type === "dataset")
        props.fetchQueryData(props.content).then(setAll)
      if (props.content.config.type === "file")
        setAll(props.content.data[0])
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


/**
 * Created by Jacob Xie on 11/23/2020
 */

import React, {useRef, useState} from 'react'
import ProTable, {ProColumns} from "@ant-design/pro-table"
import {FormOutlined} from "@ant-design/icons"

import {Struct} from "./DatasetStruct/Struct"
import * as DataType from "../GalleryDataType"
import {Button} from "antd"


interface ActionType {
  reload: (resetPageIndex?: boolean) => void
  fetchMore: () => void
  reset: () => void
}

const genTableColumn = (data: Record<string, any>[]) => {
  if (data.length > 0) {
    return Object.keys(data[0]).map((k: string) => ({
      title: k,
      dataIndex: k,
      ellipsis: true
    }))
  }
  return [{}]
}

export interface DatasetProps {
  storages: DataType.StorageSimple[]
  storageOnSelect: (id: string) => Promise<string[]>
  tableOnSelect: (tableName: string) => Promise<any[]>
  tableOnDelete: (tableName: string) => Promise<any[]>
  sqlOnExecute: (sql: string) => Promise<any[]>
  fileOnUpload: (option: any, data: any) => Promise<any>
}

export const Dataset = (props: DatasetProps) => {
  const ref = useRef<ActionType>()

  const [selectedTable, setSelectedTable] = useState<string>()
  const [data, setData] = useState<any[]>([])
  const [columns, setColumns] = useState<ProColumns[]>([{}])

  const onSelectTable = async (tb: string) => {
    const res = await props.tableOnSelect(tb)
    setSelectedTable(tb)
    if (res && ref.current) {
      setColumns(genTableColumn(res) as ProColumns[])
      setData(res)
      ref.current.reload()
    }
  }

  const onDeleteTable = async (tb: string) => {
    const res = await props.tableOnDelete(tb)
    if (res && ref.current) {
      ref.current.reload()
    }
  }

  const onExecuteSql = async (sqlStr: string) => {
    const res = await props.sqlOnExecute(sqlStr)
    if (res && ref.current) {
      setColumns(genTableColumn(res) as ProColumns[])
      setData(res)
      ref.current.reload()
    }
  }

  const clearData = () => {
    setSelectedTable(undefined)
    setData([])
    setColumns([{}])
  }

  const storageOnSelect = (id: string) => {
    clearData()
    return props.storageOnSelect(id)
  }

  return (
    <ProTable
      actionRef={ref}
      size="small"
      columns={columns}
      pagination={{
        defaultPageSize: 15,
        showSizeChanger: true
      }}
      scroll={{x: true}}
      toolbar={{
        actions: [
          <Button
            key="edit"
            type="text"
            disabled
            icon={<FormOutlined/>}
          />
        ]
      }}
      tableRender={(_, dom) =>
        <Struct
          storages={props.storages}
          storageOnSelect={storageOnSelect}
          tableOnSelect={onSelectTable}
          tableOnDelete={onDeleteTable}
          sqlOnExecute={onExecuteSql}
          fileOnUpload={props.fileOnUpload}
        >
          {dom}
        </Struct>
      }
      params={{key: data}}
      request={async () => {
        const d = data.map((i, idx) => ({...i, key: idx}))
        return {
          success: true,
          data: d,
        }
      }}
      search={false}
      dateFormatter="string"
      headerTitle={selectedTable}
    />
  )
}


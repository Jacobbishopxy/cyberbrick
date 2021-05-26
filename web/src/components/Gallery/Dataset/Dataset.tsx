/**
 * Created by Jacob Xie on 11/23/2020
 */

import {useRef, useState} from "react"
import ProTable, {ActionType, ProColumns} from "@ant-design/pro-table"
import {FormOutlined} from "@ant-design/icons"

import {Struct} from "./DatasetStruct/Struct"
import * as DataType from "../GalleryDataType"
import {Button} from "antd"


const genTableColumn = (data: Record<string, any>[]) => {
  if (data.length > 0)
    return Object.keys(data[0]).filter(k => k !== "index").map((k: string) => ({
      title: k,
      dataIndex: k,
      ellipsis: true
    }))
  return [{}]
}

export interface DatasetProps {
  storageOnFetch: () => Promise<DataType.StorageSimple[]>
  storageOnSelect: (id: string) => Promise<string[]>
  tableOnSelect: (id: string, tableName: string) => Promise<string[]>
  tableOnRename: (id: string, tableName: string, replacement: string) => Promise<any[]>
  tableOnDelete: (id: string, tableName: string) => Promise<any[]>
  tableOnClick: (id: string, tableName: string) => Promise<any[]>
  querySelectorOnSubmit: (id: string, value: Record<string, any>) => Promise<any[]>
  sqlOnExecute: (id: string, sql: string) => Promise<any[]>
  uploadAddress?: String
  fileOnUpload: (option: any, data: any) => Promise<any>
}

export const Dataset = (props: DatasetProps) => {
  const ref = useRef<ActionType>()

  const [selectedTable, setSelectedTable] = useState<string>()
  const [data, setData] = useState<any[]>([])
  const [columns, setColumns] = useState<ProColumns[]>([{}])

  const onClickTable = async (id: string, tb: string) => {
    const res = await props.tableOnClick(id, tb)
    setSelectedTable(tb)
    if (res && ref.current) {
      setColumns(genTableColumn(res) as ProColumns[])
      setData(res)
      ref.current.reload()
    }
  }

  const onSelectTable = async (id: string, tb: string) => {
    const res = await props.tableOnSelect(id, tb)
    setSelectedTable(tb)
    if (res) {
      return res
    }
    return []
  }

  const onQuerySelect = async (id: string, value: Record<string, any>) => {
    const res = await props.querySelectorOnSubmit(id, value)
    setSelectedTable(value.tableName)
    if (res && ref.current) {
      setColumns(genTableColumn(res) as ProColumns[])
      setData(res)
      ref.current.reload()
    }
  }

  const onRenameTable = async (id: string, tb: string, rp: string) => {
    const res = await props.tableOnRename(id, tb, rp)
    if (res && ref.current)
      ref.current.reload()
  }

  const onDeleteTable = async (id: string, tb: string) => {
    const res = await props.tableOnDelete(id, tb)
    if (res && ref.current)
      ref.current.reload()
  }

  const onExecuteSql = async (id: string, sqlStr: string) => {
    const res = await props.sqlOnExecute(id, sqlStr)
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
        defaultPageSize: 20,
        showSizeChanger: true
      }}
      scroll={{x: true}}
      toolbar={{
        actions: [
          <Button
            key="edit"
            type="text"
            disabled
            icon={<FormOutlined />}
          />
        ]
      }}
      tableRender={(_, dom) =>
        <Struct
          storagesOnFetch={props.storageOnFetch}
          storageOnSelect={storageOnSelect}
          tableOnClick={onClickTable}
          tableOnRename={onRenameTable}
          tableOnDelete={onDeleteTable}
          tableOnSelect={onSelectTable}
          querySelectorOnSubmit={onQuerySelect}
          sqlOnExecute={onExecuteSql}
          uploadAddress={props.uploadAddress}
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


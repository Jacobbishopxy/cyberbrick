/**
 * Created by Jacob Xie on 11/25/2020
 */

import React, {useState} from 'react'
import ProForm, {ProFormSelect} from "@ant-design/pro-form"

import * as DataType from "@/components/Gallery/GalleryDataType"


export interface QuerySelectorProps {
  storagesOnFetch: () => Promise<DataType.StorageSimple[]>
  storageOnSelect: (id: string) => Promise<string[]>
  tableOnSelect: (id: string, name: string) => Promise<string[]>
}

export const QuerySelector = (props: QuerySelectorProps) => {

  const [storage, setStorage] = useState<string>()
  const [table, setTable] = useState<string>()
  const [columns, setColumns] = useState<string[]>()

  const onValuesChange = (value: Record<string, any>) => {
    if (value.id) setStorage(value.id)
    if (value.tableName) setTable(value.tableName)
    if (value.selects) setColumns(value.selects)
  }

  const getStorages = async () => props.storagesOnFetch()
    .then(res => res.map(item => ({label: item.name, value: item.id})))

  const getTables = async () => {
    if (storage)
      return props.storageOnSelect(storage).then(res => res.map(item => ({label: item, value: item})))
    return Promise.reject()
  }

  const getColumns = async () => {
    if (storage && table)
      return props.tableOnSelect(storage, table).then(res => res.map(item => ({label: item, value: item})))
    return Promise.reject()
  }

  return (
    <ProForm
      name="query-selector"
      onValuesChange={onValuesChange}
      onFinish={async (value) => console.log(value)}
    >
      <ProFormSelect
        name="id"
        label="Database"
        placeholder="Please select a database"
        rules={[{required: true, message: 'Please select your database!'}]}
        request={getStorages}
      />
      <ProFormSelect
        name="tableName"
        label="Table"
        placeholder="Please select a table"
        rules={[{required: true, message: 'Please select your table!'}]}
        params={storage}
        request={getTables}
      />
      <ProFormSelect
        name="selects"
        label="Columns"
        fieldProps={{mode: "multiple"}}
        placeholder="Please select columns"
        params={table}
        request={getColumns}
      />

    </ProForm>
  )
}


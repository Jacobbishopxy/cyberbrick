/**
 * Created by Jacob Xie on 11/25/2020
 */

import React, {useEffect, useState} from 'react'
import ProForm, {ProFormSelect} from "@ant-design/pro-form"
import {Button, Form, Input, Select, Space} from "antd"
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons'

import * as DataType from "@/components/Gallery/GalleryDataType"


interface OptionType {
  label: string
  value: any
}

const symbolOption = [
  "=",
  ">",
  ">=",
  "<",
  "<=",
]

export interface QuerySelectorProps {
  storagesOnFetch: () => Promise<DataType.StorageSimple[]>
  storageOnSelect: (id: string) => Promise<string[]>
  tableOnSelect: (id: string, name: string) => Promise<string[]>
}

export const QuerySelector = (props: QuerySelectorProps) => {

  const [storage, setStorage] = useState<string>()
  const [table, setTable] = useState<string>()

  const [tableSelects, setTableSelects] = useState<OptionType[]>()
  const [columnSelects, setColumnSelects] = useState<OptionType[]>()


  const onValuesChange = (value: Record<string, any>) => {
    if (value.id) setStorage(value.id)
    if (value.tableName) setTable(value.tableName)
  }

  const getStorages = async () => props.storagesOnFetch()
    .then(res => res.map(item => ({label: item.name, value: item.id})))

  useEffect(() => {
    if (storage)
      props.storageOnSelect(storage)
        .then(res => {
          const ans = res.map(item => ({label: item, value: item}))
          setTableSelects(ans)
        })
  }, [storage])

  useEffect(() => {
    if (storage && table)
      props.tableOnSelect(storage, table)
        .then(res => {
          const ans = res.map(item => ({label: item, value: item}))
          setColumnSelects(ans)
        })
  }, [table])


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
        options={tableSelects}
      />

      <ProFormSelect
        name="selects"
        label="Columns"
        fieldProps={{mode: "multiple"}}
        placeholder="Please select columns"
        options={columnSelects}
      />

      <div style={{marginBottom: 8}}>Conditions</div>
      <Form.List name="conditions">
        {(fields, {add, remove}) => (
          <>
            {fields.map(field => (
              <Space key={field.key} style={{display: 'flex'}} align="baseline">
                <Form.Item
                  {...field}
                  name={[field.name, 'field']}
                  fieldKey={[field.fieldKey, 'field']}
                  rules={[{required: true, message: 'Missing field'}]}
                >
                  <Select placeholder="Field" style={{width: 200}}>
                    {
                      columnSelects!.map(c => (
                        <Select.Option key={c.label} value={c.label}>{c.value}</Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>

                <Form.Item
                  {...field}
                  name={[field.name, 'symbol']}
                  fieldKey={[field.fieldKey, 'symbol']}
                  rules={[{required: true, message: 'Missing symbol'}]}
                >
                  <Select placeholder="Symbol" style={{width: 100}}>
                    {
                      symbolOption.map(s => (
                        <Select.Option key={s} value={s}>{s}</Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>

                <Form.Item
                  {...field}
                  name={[field.name, 'value']}
                  fieldKey={[field.fieldKey, 'value']}
                  rules={[{required: true, message: 'Missing value'}]}
                >
                  <Input placeholder="Value"/>
                </Form.Item>

                <MinusCircleOutlined onClick={() => remove(field.name)}/>
              </Space>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                block
                icon={<PlusOutlined/>}
                disabled={table === undefined}
                onClick={() => add()}
              >
                Add field
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </ProForm>
  )
}


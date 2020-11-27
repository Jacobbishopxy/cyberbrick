/**
 * Created by Jacob Xie on 11/25/2020
 */

import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react'
import {ProFormSelect} from "@ant-design/pro-form"
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

export interface BaseFormProps {
  initialValues?: Record<string, any>
  storagesOnFetch: () => Promise<DataType.StorageSimple[]>
  storageOnSelect: (id: string) => Promise<string[]>
  tableOnSelect: (id: string, name: string) => Promise<string[]>
}

export interface BaseFormRef {
  onValuesChange: (values: Record<string, any>) => void
}

export const BaseForm =
  forwardRef((props: BaseFormProps, ref: React.Ref<BaseFormRef>) => {

    const [storage, setStorage] = useState<string>(props.initialValues?.id || undefined)
    const [table, setTable] = useState<string>(props.initialValues?.tableName || undefined)

    const [tableSelects, setTableSelects] = useState<OptionType[]>()
    const [columnSelects, setColumnSelects] = useState<OptionType[]>()

    const getStorages = async () => props.storagesOnFetch()
      .then(res => res.map(item => ({label: item.name, value: item.id})))

    const storageOnSelect = (s: string) => props.storageOnSelect(s)
      .then(res => {
        const ans = res.map(item => ({label: item, value: item}))
        setTableSelects(ans)
      })

    const tableOnSelect = (s: string, t: string) => props.tableOnSelect(s, t)
      .then(res => {
        const ans = res.map(item => ({label: item, value: item}))
        setColumnSelects(ans)
      })

    useEffect(() => {
      if (storage) storageOnSelect(storage).finally()
    }, [storage])

    useEffect(() => {
      if (storage && table) tableOnSelect(storage!, table!).finally()
    }, [table])

    const onValuesChange = (value: Record<string, any>) => {
      if (value.id) setStorage(value.id)
      if (value.tableName) setTable(value.tableName)
    }
    useImperativeHandle(ref, () => ({onValuesChange}))

    return (
      <>
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
      </>
    )
  })


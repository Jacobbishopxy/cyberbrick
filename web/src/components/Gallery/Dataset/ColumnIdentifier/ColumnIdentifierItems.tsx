/**
 * Created by Jacob Xie on 1/18/2021
 */

import React, {useState} from 'react'
import {Button, Form, Select, Space} from "antd"
import {DeleteTwoTone, PlusOutlined} from "@ant-design/icons"
import _ from "lodash"


const columnTypeOptions = [
  "default",
  "date",
  "number",
  "percent",
]

export interface ColumnIdentifierProps {
  columns: string[]
}

export const ColumnIdentifier = (props: ColumnIdentifierProps) => {

  const [columnsSelected, setColumnsSelected] = useState<string[]>([])

  const onColumnSelect = (idx: number) => (column: string) => {
    if (columnsSelected[idx]) {
      const ud = columnsSelected.map((c, i) =>
        idx === i ? column : c
      )
      setColumnsSelected(ud)
    } else
      setColumnsSelected([...columnsSelected, column])
  }

  const onColumnRemove = (idx: number) => {
    if (columnsSelected[idx]) {
      const ud = columnsSelected.filter((c, i) =>
        idx !== i
      )
      setColumnsSelected(ud)
    }
  }

  const getColumnsLeft = () => _.differenceWith(props.columns, columnsSelected)

  return (
    <Form.List name="display">
      {(fields, {add, remove}) =>
        <>
          {fields.map((field, idx) =>
            <Space key={field.key} style={{display: "flex"}}>
              <Form.Item
                {...field}
                name={[field.name, "column"]}
                fieldKey={[field.fieldKey, "column"]}
                label="Column"
                rules={[{required: true, message: "Missing field"}]}
              >
                <Select
                  placeholder="Column"
                  style={{width: 150}}
                  onChange={onColumnSelect(idx)}
                >
                  {
                    getColumnsLeft().map(c =>
                      <Select.Option key={c} value={c}>{c}</Select.Option>
                    )
                  }
                </Select>
              </Form.Item>

              <Form.Item
                {...field}
                name={[field.name, "type"]}
                fieldKey={[field.fieldKey, "type"]}
                label="Type"
                rules={[{required: true, message: "Missing field"}]}
              >
                <Select placeholder="Type" style={{width: 150}}>
                  {
                    columnTypeOptions.map(t =>
                      <Select.Option key={t} value={t}>{t}</Select.Option>
                    )
                  }
                </Select>
              </Form.Item>

              <Button
                icon={<DeleteTwoTone twoToneColor="red"/>}
                type="link"
                danger
                onClick={() => {
                  remove(field.name)
                  onColumnRemove(idx)
                }}
              />

            </Space>
          )}
          <Form.Item>
            <Button
              type="dashed"
              style={{width: 350}}
              icon={<PlusOutlined/>}
              onClick={() => add()}
            >
              Add criteria
            </Button>
          </Form.Item>
        </>
      }
    </Form.List>
  )
}


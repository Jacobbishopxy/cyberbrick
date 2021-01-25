/**
 * Created by Jacob Xie on 1/22/2021
 */

import React from 'react'
import {Button, Divider, Form, Select, Space} from "antd"
import {ProFormSelect} from "@ant-design/pro-form"
import {DeleteTwoTone, PlusOutlined} from "@ant-design/icons"

import {Mixin} from "./data"


export interface MixinFormItemsProps {
  mixin: Mixin
  columns?: string[]
}

export const MixinFormItems = (props: MixinFormItemsProps) => {

  const scatter = <>
    <Divider/>
    <Form.List name="scatter">
      {(fields, {add, remove}) =>
        <>
          {fields.map((field) =>
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
                  style={{width: 200}}
                >
                  {props.columns?.map(c =>
                    <Select.Option key={c} value={c}>{c}</Select.Option>
                  )}
                </Select>
              </Form.Item>

              <Form.Item
                {...field}
                name={[field.name, "size"]}
                fieldKey={[field.fieldKey, "size"]}
                label="Size column"
              >
                <Select
                  placeholder="Size column"
                  style={{width: 200}}
                  allowClear
                >
                  {props.columns?.map(c =>
                    <Select.Option key={c} value={c}>{c}</Select.Option>
                  )}
                </Select>
              </Form.Item>

              <Button
                icon={<DeleteTwoTone twoToneColor="red"/>}
                type="link"
                danger
                onClick={() => remove(field.name)}
              />
            </Space>
          )}
          <Form.Item>
            <Button
              type="dashed"
              block
              icon={<PlusOutlined/>}
              onClick={() => add()}
            >
              Add scatter column
            </Button>
          </Form.Item>
        </>
      }
    </Form.List>
  </>

  const mixinFormGenerator = () => {
    switch (props.mixin) {
      case "lineBar":
        return (
          <>
            <Divider/>
            <ProFormSelect
              name="bar"
              label="Display as Bar chart"
              fieldProps={{mode: "multiple"}}
              options={props.columns?.map(c => ({label: c, value: c}))}
              width="lg"
            />
          </>
        )
      case "lineScatter":
        return scatter
      case "scatter":
        return scatter
      default:
        return <></>
    }
  }

  return mixinFormGenerator()
}


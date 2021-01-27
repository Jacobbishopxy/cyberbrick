/**
 * Created by Jacob Xie on 1/22/2021
 */

import React from "react"
import {Button, Form, Input, Radio, Select} from "antd"
import ProForm from "@ant-design/pro-form"
import {DeleteTwoTone, PlusOutlined} from "@ant-design/icons"

interface YAxisSelectorFormItemsProps {
  yAxisOnChange: (idx: number) => (cols: string[]) => void
  getYAxisRest: () => string[]
  yAxisOnRelease: (idx: number) => void
}

export const YAxisSelectorFormItems = (props: YAxisSelectorFormItemsProps) => {

  return (
    <Form.List name="y" initialValue={[{columns: [], position: "left"}]}>
      {(fields, {add, remove}) => (
        <>
          {fields.map((field, idx) => (
            <ProForm.Group key={idx}>
              <Form.Item
                {...field}
                name={[field.name, 'columns']}
                fieldKey={[field.fieldKey, 'columns']}
                label='Columns'
                rules={[{required: true, message: 'Missing columns', type: 'array'}]}
              >
                <Select
                  mode="multiple"
                  placeholder="Field"
                  style={{width: 200}}
                  onChange={props.yAxisOnChange(idx)}
                >
                  {
                    props.getYAxisRest().map(c => <Select.Option key={c} value={c}>{c}</Select.Option>)
                  }
                </Select>
              </Form.Item>

              <Form.Item
                {...field}
                name={[field.name, 'position']}
                fieldKey={[field.fieldKey, 'position']}
                label='Position'
                rules={[{required: true, message: 'Missing position'}]}
                initialValue="right"
              >
                <Radio.Group disabled={idx === 0}>
                  <Radio value="left">Left</Radio>
                  <Radio value="right">Right</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                {...field}
                name={[field.name, "name"]}
                fieldKey={[field.fieldKey, 'name']}
                label="Name"
              >
                <Input style={{width: 200}} placeholder="Name of Y-axis"/>
              </Form.Item>

              {
                idx === 0 ?
                  <></> :
                  <Button
                    icon={<DeleteTwoTone twoToneColor="red"/>}
                    type="link"
                    danger
                    onClick={() => {
                      remove(field.name)
                      props.yAxisOnRelease(idx)
                    }}
                  />
              }
            </ProForm.Group>
          ))}
          <Form.Item>
            <Button
              type="dashed"
              style={{width: 200}}
              icon={<PlusOutlined/>}
              onClick={() => add()}
            >
              Add Y-Axis option
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  )
}


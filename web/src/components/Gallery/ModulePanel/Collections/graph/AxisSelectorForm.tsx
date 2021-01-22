/**
 * Created by Jacob Xie on 12/2/2020
 */

import React, {useState} from 'react'
import ProForm, {ProFormSelect} from "@ant-design/pro-form"
import {Button, Form, Input, Radio, Select, Space} from "antd"
import {DeleteTwoTone, PlusOutlined} from "@ant-design/icons"
import _ from "lodash"


export type Mixin = "lineBar" | "lineScatter" | undefined

export interface AxisSelectorFormProps {
  mixin: Mixin
  columns?: string[]
}

const mixinFormGenerator = (mixin: Mixin, columns: string[]) => {
  switch (mixin) {
    case "lineBar":
      return <ProFormSelect
        name="bar"
        label="Display as Bar chart"
        fieldProps={{mode: "multiple"}}
        options={columns.map(c => ({label: c, value: c}))}
        width="lg"
      />
    case "lineScatter":
      // todo: optional double select is required for scatter size
      return <ProFormSelect
        name="scatter"
        label="Display as Scatter chart"
        fieldProps={{mode: "multiple"}}
        options={columns.map(c => ({label: c, value: c}))}
        width="lg"
      />
    default:
      return <></>
  }
}


export const AxisSelectorForm = (props: AxisSelectorFormProps) => {

  const [yAxis, setYAxis] = useState<string[] | undefined>(props.columns)
  const [yAxisRecord, setYAxisRecord] = useState<string[][]>([])

  const xAxisOnChange = (col: string) =>
    setYAxis(_.differenceWith(props.columns, [col]))

  const yAxisOnChange = (idx: number) => (cols: string[]) => {
    if (yAxisRecord[idx]) {
      const ud = yAxisRecord.map((r, i) =>
        idx === i ? cols : r
      )
      setYAxisRecord(ud)
    } else
      setYAxisRecord([...yAxisRecord, cols])
  }

  const yAxisOnRelease = (idx: number) => {
    if (yAxisRecord[idx]) {
      const ud = yAxisRecord.filter((r, i) =>
        idx !== i
      )
      setYAxisRecord(ud)
    }
  }

  const getYAxisRest = () => _.differenceWith(yAxis, _.flatten(yAxisRecord))


  return props.columns ? (
    <>
      <ProForm.Group title="X">
        <Form.Item
          name={["x", "column"]}
          label="X-Axis"
          rules={[{required: true, message: "Select a column for xAxis!"}]}
        >
          <Select
            placeholder="Select a column for xAxis!"
            onChange={xAxisOnChange}
            style={{width: 200}}
          >
            {props.columns.map(c => <Select.Option key={c} value={c}>{c}</Select.Option>)}
          </Select>
        </Form.Item>

        <Form.Item
          name={["x", "type"]}
          label="Type"
          rules={[{required: true, message: "Select a type for xAxis!"}]}
        >
          <Radio.Group>
            <Radio value="value">Value</Radio>
            <Radio value="category">Category</Radio>
            <Radio value="time">Time</Radio>
            <Radio value="log">Log</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name={["x", "name"]}
          label="Name"
        >
          <Input style={{width: 200}} placeholder="Name of X-axis"/>
        </Form.Item>
      </ProForm.Group>

      <ProForm.Group title="Y">
        <Space direction="vertical" style={{marginBottom: 24}}>
          <div>Y-Axis (View only)</div>
          <Select
            mode="multiple"
            placeholder="Field"
            style={{width: 200}}
            value={getYAxisRest()}
            maxTagCount="responsive"
          >
            {
              getYAxisRest().map(c => <Select.Option key={c} value={c}>{c}</Select.Option>)
            }
          </Select>
        </Space>
        <Form.Item
          name="yDefaultName"
          label="Name"
        >
          <Input style={{width: 200}} placeholder="Name of X-axis"/>
        </Form.Item>
      </ProForm.Group>

      <Form.List name="y">
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
                    onChange={yAxisOnChange(idx)}
                  >
                    {
                      getYAxisRest().map(c => <Select.Option key={c} value={c}>{c}</Select.Option>)
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
                  <Radio.Group>
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
                  <Input placeholder="Name of Y-axis"/>
                </Form.Item>

                <DeleteTwoTone
                  twoToneColor="red"
                  onClick={() => {
                    remove(field.name)
                    yAxisOnRelease(idx)
                  }}
                  style={{fontSize: 20, marginTop: 7}}
                />
              </ProForm.Group>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                block
                icon={<PlusOutlined/>}
                onClick={() => add()}
              >
                Add Y-Axis option
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      {
        mixinFormGenerator(props.mixin, props.columns)
      }
    </>
  ) : <></>
}


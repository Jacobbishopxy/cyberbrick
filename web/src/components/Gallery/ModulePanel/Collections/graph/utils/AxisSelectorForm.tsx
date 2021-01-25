/**
 * Created by Jacob Xie on 12/2/2020
 */

import React, {useState} from 'react'
import ProForm from "@ant-design/pro-form"
import {Divider, Form, Input, Radio, Select} from "antd"
import _ from "lodash"

import {Mixin} from "./data"
import {MixinFormItems} from "./MixinFormItems"
import {YAxisSelectorFormItems} from "./YAxisSelectorFormItems"


export interface AxisSelectorFormProps {
  mixin: Mixin
  columns?: string[]
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

  const selectAll = (idx: number) => {
    yAxisOnChange(idx)(getYAxisRest())
  }

  return props.columns ? (
    <>
      <ProForm.Group title="X">
        <Form.Item
          name={["x", "column"]}
          label="Column"
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

      <Divider/>

      <ProForm.Group title="Y">
        <YAxisSelectorFormItems
          yAxisOnChange={yAxisOnChange}
          getYAxisRest={getYAxisRest}
          yAxisOnRelease={yAxisOnRelease}
          selectAll={selectAll}
        />
      </ProForm.Group>


      <MixinFormItems mixin={props.mixin} columns={yAxis}/>
    </>
  ) : <></>
}


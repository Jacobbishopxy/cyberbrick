/**
 * Created by Jacob Xie on 12/2/2020
 */

import { useState, useEffect } from "react"
import ProForm from "@ant-design/pro-form"
import { Divider, Form, Input, Radio, Select, FormInstance } from "antd"
import { FormattedMessage } from "umi"
import _ from "lodash"

import { Mixin } from "@/components/Gallery/Utils/data"
import { MixinFormItems } from "./MixinFormItems"
import { YAxisSelectorFormItems } from "./YAxisSelectorFormItems"
import { DisplayFormThemeSelector } from "./DisplayFormThemeSelector"

export interface DisplayFormCartesianCoordProps {
  mixin: Mixin
  columns?: string[]
  formRef: React.MutableRefObject<FormInstance<any> | undefined> | undefined
}

export const DisplayFormCartesianCoord = (props: DisplayFormCartesianCoordProps) => {

  const [yAxis, setYAxis] = useState<string[] | undefined>(props.columns)
  const [yAxisRecord, setYAxisRecord] = useState<string[][]>([])

  const xAxisOnChange = (col: string) =>
    setYAxis(_.differenceWith(props.columns, [col]))

  const yAxisOnChange = (idx: number) => (cols: string[]) => {
    console.log(242424, idx, cols, yAxisRecord)
    if (yAxisRecord[idx]) {
      const ud = yAxisRecord.map((r, i) =>
        idx === i ? cols : r
      )
      setYAxisRecord(ud)
    } else
      setYAxisRecord([...yAxisRecord, cols])
  }
  useEffect(() => {
    console.log(24242424, yAxisRecord)
  }, [yAxisRecord])

  const yAxisOnRelease = (idx: number) => {
    if (yAxisRecord[idx]) {
      const ud = yAxisRecord.filter((r, i) =>
        idx !== i
      )
      setYAxisRecord(ud)
    }
  }

  const getYAxisRest = () => _.differenceWith(yAxis, _.flatten(yAxisRecord))

  console.log(55, props.columns, props.mixin)
  return props.columns ? (
    <>
      <ProForm.Group title="X">
        <Form.Item
          name={["x", "column"]}
          label={<FormattedMessage id="gallery.component.general33" />}
          rules={[{ required: true, message: "Select a column for xAxis!" }]}
        >
          <Select
            placeholder="Select a column for xAxis!"
            onChange={xAxisOnChange}
            style={{ width: 200 }}
          >
            {props.columns.map(c => <Select.Option key={c} value={c}>{c}</Select.Option>)}
          </Select>
        </Form.Item>

        <Form.Item
          name={["x", "type"]}
          label={<FormattedMessage id="gallery.component.general16" />}
          rules={[{ required: true, message: "Select a type for xAxis!" }]}
        >
          <Radio.Group>
            <Radio value="value">
              <FormattedMessage id="gallery.component.module-panel.graph.utils.display-form2" />
            </Radio>
            <Radio value="category">
              <FormattedMessage id="gallery.component.module-panel.graph.utils.display-form3" />
            </Radio>
            <Radio value="time">
              <FormattedMessage id="gallery.component.module-panel.graph.utils.display-form4" />
            </Radio>
            <Radio value="log">
              <FormattedMessage id="gallery.component.module-panel.graph.utils.display-form5" />
            </Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name={["x", "name"]}
          label={<FormattedMessage id="gallery.component.general5" />}
        >
          <Input style={{ width: 200 }} placeholder="Name of X-axis" />
        </Form.Item>
      </ProForm.Group>

      <Divider />

      <ProForm.Group title="Y">
        <YAxisSelectorFormItems
          yAxis={yAxis}
          yAxisOnChange={yAxisOnChange}
          getYAxisRest={getYAxisRest}
          yAxisOnRelease={yAxisOnRelease}
          formRef={props.formRef}
        />
      </ProForm.Group>

      <MixinFormItems mixin={props.mixin} columns={yAxis} />

      <Divider />

      <DisplayFormThemeSelector />
    </>
  ) : <></>
}


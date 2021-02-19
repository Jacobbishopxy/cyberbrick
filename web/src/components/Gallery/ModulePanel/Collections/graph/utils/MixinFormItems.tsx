/**
 * Created by Jacob Xie on 1/22/2021
 */

import {Button, Divider, Form, InputNumber, Select} from "antd"
import ProForm, {ProFormSelect} from "@ant-design/pro-form"
import {DeleteTwoTone, PlusOutlined} from "@ant-design/icons"
import {FormattedMessage} from "umi"

import {Mixin} from "./data"


export interface MixinFormItemsProps {
  mixin: Mixin
  columns?: string[]
}

export const MixinFormItems = (props: MixinFormItemsProps) => {

  const scatter = <Form.List name="scatter">
    {(fields, {add, remove}) =>
      <>
        {fields.map((field, idx) =>
          <ProForm.Group key={idx}>
            <Form.Item
              {...field}
              name={[field.name, "column"]}
              fieldKey={[field.fieldKey, "column"]}
              label={<FormattedMessage id="gallery.component.general33"/>}
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
              label={<FormattedMessage id="gallery.component.module-panel.graph.utils.mixin-form-items1"/>}
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

            <Form.Item
              {...field}
              name={[field.name, "min"]}
              fieldKey={[field.fieldKey, "min"]}
              label={<FormattedMessage id="gallery.component.module-panel.graph.utils.mixin-form-items2"/>}
              initialValue={0}
            >
              <InputNumber
                placeholder="min"
                style={{width: 100}}
                min={0}
                max={200}
              />
            </Form.Item>

            <Form.Item
              {...field}
              name={[field.name, "max"]}
              fieldKey={[field.fieldKey, "max"]}
              label={<FormattedMessage id="gallery.component.module-panel.graph.utils.mixin-form-items3"/>}
              initialValue={100}
            >
              <InputNumber
                placeholder="max"
                style={{width: 100}}
                min={0}
                max={200}
              />
            </Form.Item>

            <Button
              icon={<DeleteTwoTone twoToneColor="red"/>}
              type="link"
              danger
              onClick={() => remove(field.name)}
            />
          </ProForm.Group>
        )}
        <Form.Item>
          <Button
            type="dashed"
            style={{width: 200}}
            icon={<PlusOutlined/>}
            onClick={() => add()}
          >
            <FormattedMessage id="gallery.component.module-panel.graph.utils.mixin-form-items4"/>
          </Button>
        </Form.Item>
      </>
    }
  </Form.List>

  const mixinFormGenerator = () => {
    switch (props.mixin) {
      case "lineBar":
        return (
          <>
            <Divider/>
            <ProForm.Group
              title={<FormattedMessage id="gallery.component.module-panel.graph.utils.mixin-form-items6"/>}
            >
              <ProFormSelect
                name="bar"
                label={<FormattedMessage id="gallery.component.module-panel.graph.utils.mixin-form-items5"/>}
                placeholder="Please select columns"
                fieldProps={{mode: "multiple"}}
                options={props.columns?.map(c => ({label: c, value: c}))}
                width="lg"
              />
            </ProForm.Group>
          </>
        )
      case "lineScatter":
        return (
          <>
            <Divider/>
            <ProForm.Group
              title={<FormattedMessage id="gallery.component.module-panel.graph.utils.mixin-form-items6"/>}
            >
              {scatter}
            </ProForm.Group>
          </>
        )
      case "scatter":
        return (
          <>
            <Divider/>
            <ProForm.Group
              title={<FormattedMessage id="gallery.component.module-panel.graph.utils.mixin-form-items6"/>}
            >
              {scatter}
            </ProForm.Group>
          </>
        )
      default:
        return <></>
    }
  }

  return mixinFormGenerator()
}


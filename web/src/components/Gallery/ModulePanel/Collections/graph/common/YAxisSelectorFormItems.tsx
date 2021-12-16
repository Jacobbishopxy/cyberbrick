/**
 * Created by Jacob Xie on 1/22/2021
 */

import { Button, Form, Input, Radio, Select, FormInstance, Divider } from "antd"
import ProForm, { ProFormSelect } from "@ant-design/pro-form"
import { DeleteTwoTone, PlusOutlined } from "@ant-design/icons"
import { FormattedMessage } from "umi"
import { useState, useEffect } from "react"

import { values } from "@umijs/deps/compiled/lodash"
import './styles.less'

interface YAxisSelectorFormItemsProps {
  yAxis: string[] | undefined
  yAxisOnChange: (idx: number) => (cols: string[]) => void
  getYAxisRest: () => string[]
  yAxisOnRelease: (idx: number) => void
  formRef: React.MutableRefObject<FormInstance<any> | undefined> | undefined
}

export const YAxisSelectorFormItems = (props: YAxisSelectorFormItemsProps) => {
  console.log(24, props.formRef?.current?.getFieldValue('y'))
  return (
    <Form.List name="y" >
      {(fields, { add, remove }) => (
        <>
          {fields.map((field, idx, fields) => {
            console.log(29, field)
            return (
              <ProForm.Group key={idx} >
                <ProFormSelect
                  {...field}
                  name={[field.name, 'columns']}
                  fieldKey={[field.fieldKey, 'columns']}
                  label={<FormattedMessage id="gallery.component.general33" />}
                  rules={[{ required: true, message: '请选择列', type: 'array' }]}
                  placeholder="Column"
                  // className="ySelectsStyle"
                  style={{ width: 200 }}
                  options={props.yAxis?.slice()}

                  fieldProps={
                    {
                      mode: "multiple",
                      // 【全选与反选】按钮
                      dropdownRender: (menu) => {
                        return (
                          <div>
                            {menu}
                            <Button
                              onClick={() => {

                                const newY = props.formRef?.current?.getFieldValue('y')
                                newY[idx] = {
                                  columns: []
                                }
                                newY[idx].columns = newY[idx]?.columns?.length === props.yAxis?.slice().length ? [] : props.yAxis?.slice()
                                props.formRef?.current?.setFields([{
                                  name: 'y',
                                  value: newY
                                }])
                              }}
                              type="primary"
                              style={
                                {
                                  height: '100%',
                                  width: '100%'
                                }
                              }>全选</Button>
                          </div>
                        )
                      }
                    }
                  }
                >

                </ProFormSelect>

                {/* 类型 */}
                <Form.Item
                  {...field}
                  fieldKey={[field.fieldKey, 'type']}
                  name={[field.name, "type"]}
                  label={<FormattedMessage id="gallery.component.general16" />}
                  rules={[{ required: true, message: "Select a type for xAxis!" }]}
                // initialValue={'value'}
                >
                  <Radio.Group
                  >
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

                {/* 位置 */}
                <Form.Item
                  {...field}
                  name={[field.name, 'position']}
                  fieldKey={[field.fieldKey, 'position']}
                  label={<FormattedMessage id="gallery.component.general45" />}
                  rules={[{ required: true, message: 'Missing position' }]}
                // initialValue="right"
                >
                  <Radio.Group >
                    <Radio value="left">
                      <FormattedMessage id="gallery.component.general46" />
                    </Radio>
                    <Radio value="right">
                      <FormattedMessage id="gallery.component.general47" />
                    </Radio>
                  </Radio.Group>
                </Form.Item>

                {/* 别名 */}
                <Form.Item
                  {...field}
                  name={[field.name, "name"]}
                  fieldKey={[field.fieldKey, 'name']}
                  label={<FormattedMessage id="gallery.component.general5" />}
                >
                  <Input style={{ width: 200 }} placeholder="Name of Y-axis" />
                </Form.Item>

                {/*删除按钮  */}
                {
                  idx === 0 ?
                    <></> :
                    <Button
                      icon={<DeleteTwoTone twoToneColor="red" />}
                      type="link"
                      danger
                      onClick={() => {
                        remove(field.name)
                        props.yAxisOnRelease(idx)
                      }}
                    />
                }

                <Divider style={{
                  display: idx === fields.length - 1 ? 'none' : 'flex'
                }}></Divider>
              </ProForm.Group>
            )
          }
          )}
          <Form.Item>
            <Button
              type="dashed"
              style={{ width: 200 }}
              icon={<PlusOutlined />}
              onClick={() => {

                add()
                console.log(62, props.formRef?.current?.getFieldValue('y'))
              }}

            >
              <FormattedMessage id="gallery.component.module-panel.graph.utils.y-axis-selector-form-items1" />
            </Button>
          </Form.Item>
        </>
      )
      }
    </Form.List >
  )
}


/**
 * Created by Jacob Xie on 8/27/2020.
 */

import React, {useState} from "react"
import {Form, Input, Modal} from "antd"
import {FormattedMessage} from "umi"
import {ColorResult, BlockPicker} from "react-color"

export interface CreationModalValue {
  name: string
  description?: string
  color?: string
}

export interface CreationModalProps {
  name?: string
  title: string
  visible: boolean
  onSubmit: (value: CreationModalValue) => void
  onCancel: () => void
  colorSelector?: boolean
  initialValues?: CreationModalValue
}

const formItemLayout = {
  labelCol: {offset: 2, span: 4},
  wrapperCol: {span: 16},
}

export const CreationModal = (props: CreationModalProps) => {
  const [form] = Form.useForm<CreationModalValue>()
  const [color, setColor] = useState<string>()

  const onCancel = () => {
    form.resetFields()
    props.onCancel()
  }
  const onOk = () => {
    form
      .validateFields()
      .then((values: any) => {
        form.resetFields()
        props.onSubmit(values)
      })
  }

  const onSelectColor = (value: ColorResult) =>
    setColor(value.hex)

  const onSelectColorComplete = (value: ColorResult) =>
    form.setFieldsValue({color: value.hex})

  return (
    <Modal
      visible={props.visible}
      title={props.title}
      onOk={onOk}
      onCancel={onCancel}
      destroyOnClose
      forceRender
    >
      <Form
        form={form}
        name={props.name}
        initialValues={props.initialValues}
        {...formItemLayout}
      >
        <Form.Item
          name="name"
          label={<FormattedMessage id="gallery.component.general5"/>}
          rules={[{required: true, message: "Name is required"}]}
        >
          <Input placeholder="Place name here"/>
        </Form.Item>
        <Form.Item
          name="description"
          label={<FormattedMessage id="gallery.component.general6"/>}
        >
          <Input placeholder="Place description here"/>
        </Form.Item>
        {
          props.colorSelector ?
            <Form.Item
              name="color"
              label={<FormattedMessage id="gallery.component.general15"/>}
            >
              <BlockPicker
                color={color}
                onChange={onSelectColor}
                onChangeComplete={onSelectColorComplete}
                triangle="hide"
                width="100%"
              />
            </Form.Item> :
            <></>
        }
      </Form>
    </Modal>
  )
}

CreationModal.defaultProps = {
  colorSelector: false
} as Partial<CreationModalProps>

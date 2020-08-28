/**
 * Created by Jacob Xie on 8/27/2020.
 */

import React from "react"
import { Form, Input, Modal } from "antd"
import * as propsData from "../data"

const formItemLayout = {
  labelCol: { offset: 2, span: 4 },
  wrapperCol: { span: 16 },
}


export const CreationModal = (props: propsData.CreationModalProps) => {
  const [form] = Form.useForm()

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

  return (
    <Modal
      visible={ props.visible }
      title={ props.title }
      onOk={ onOk }
      onCancel={ onCancel }
      destroyOnClose
      forceRender
    >
      <Form { ...formItemLayout } form={ form }>
        <Form.Item
          name="name"
          label="Name"
          rules={ [{ required: true, message: "Name is required" }] }
        >
          <Input placeholder="Place name here"/>
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
        >
          <Input placeholder="Place description here"/>
        </Form.Item>
      </Form>
    </Modal>
  )
}

/**
 * Created by Jacob Xie on 10/30/2020.
 */

import {Form, Input, InputNumber, Modal, Select} from "antd"
import {EyeInvisibleOutlined, EyeTwoTone} from '@ant-design/icons'

import * as DataType from "../GalleryDataType"

const formItemLayout = {
  labelCol: {offset: 2, span: 4},
  wrapperCol: {span: 16},
}


interface NewStorageModalProps {
  visible: boolean
  onSubmit: (value: DataType.Storage) => void
  onCancel: () => void
}

export const NewStorageModal = (props: NewStorageModalProps) => {
  const [form] = Form.useForm<DataType.Storage>()

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
      visible={props.visible}
      title="Please complete following to add a new storage:"
      onOk={onOk}
      onCancel={onCancel}
      destroyOnClose
    >
      <Form {...formItemLayout} form={form}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{required: true, message: "Name is required"}]}
        >
          <Input placeholder="Place name here"/>
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
        >
          <Input placeholder="Place description here"/>
        </Form.Item>
        <Form.Item
          name="type"
          label="Type"
          rules={[{required: true, message: "Type is required"}]}
        >
          <Select
          >
            {
              DataType.storageTypeList.map((s, idx) =>
                <Select.Option value={s} key={idx}>{s}</Select.Option>
              )
            }
          </Select>
        </Form.Item>
        <Form.Item
          name="host"
          label="Host"
          rules={[{required: true, message: "Host is required"}]}
        >
          <Input placeholder="Place host here"/>
        </Form.Item>
        <Form.Item
          name="port"
          label="Port"
          rules={[{required: true, message: "Port is required"}]}
        >
          <InputNumber placeholder="Place port here" precision={0}/>
        </Form.Item>
        <Form.Item
          name="database"
          label="Database"
          rules={[{required: true, message: "Database is required"}]}
        >
          <Input placeholder="Place database here"/>
        </Form.Item>
        <Form.Item
          name="username"
          label="Username"
          rules={[{required: true, message: "Username is required"}]}
        >
          <Input placeholder="Place username here"/>
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{required: true, message: "Password is required"}]}
        >
          <Input.Password
            placeholder="Place password here"
            iconRender={visible => (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>)}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}


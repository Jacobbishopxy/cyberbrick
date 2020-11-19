/**
 * Created by Jacob Xie on 11/19/2020
 */

import React, {useState} from 'react'
import {
  Button,
  Divider,
  Form,
  message,
  Modal,
  Space,
  Upload
} from "antd"
import {UploadOutlined} from '@ant-design/icons'


const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14},
}


export interface BaseModalProps {
  children: React.ReactElement
  setVisible: (value: boolean) => void
  visible: boolean
  upload: (option: Record<string, any>, data: any) => Promise<any>
  uploadResHandle: (value: any) => void
}

export const BaseModal = (props: BaseModalProps) => {
  const [form] = Form.useForm()

  const [uploading, setUploading] = useState<boolean>(false)
  const [uploadFiles, setUploadFiles] = useState<File[]>([])

  const uploadProps = {
    multiple: false,
    beforeUpload: (file: File) => {
      setUploadFiles([file])
      return false
    },
    onRemove: () => setUploadFiles([]),
    fileList: uploadFiles.map((i, j) => ({...i, name: i.name, uid: String(j)}))
  }

  const onUploadFile = (options: Record<string, any>) => {
    if (uploadFiles.length !== 0) {
      const data = new FormData()
      data.append("file", uploadFiles[0])
      setUploading(true)

      props.upload(options, data).then(res => {
        message.success(res.statusText)
        setUploading(false)
        setUploadFiles([])
        props.uploadResHandle(res.data)
      })
        .catch(err => {
          setUploading(false)
          message.error(JSON.stringify(err, null, 2))
        })
    }
  }

  const onReset = () => {
    setUploading(false)
    setUploadFiles([])
    form.resetFields()
  }

  const onFinish = () => {
    form.validateFields()
      .then(values => {
        onUploadFile(values)
        onReset()
        props.setVisible(false)
      })
  }


  return (
    <Modal
      title='Please complete below:'
      visible={props.visible}
      onOk={onFinish}
      onCancel={() => props.setVisible(false)}
      confirmLoading={uploading}
      okText="Confirm"
      cancelText="Discard"
    >
      <Form
        {...formItemLayout}
        form={form}
        initialValues={{numberRounding: 2, dateFormat: "%Y-%m-%d"}}
      >
        <Divider plain orientation="left" style={{color: "lightgray"}}>File</Divider>

        <Form.Item name="file" label="File">
          <Space>
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined/>}>Click to upload</Button>
            </Upload>
          </Space>
        </Form.Item>

        {props.children}

      </Form>
    </Modal>
  )
}

BaseModal.defaultProps = {} as Partial<BaseModalProps>


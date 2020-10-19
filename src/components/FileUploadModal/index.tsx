/**
 * Created by Jacob Xie on 10/16/2020.
 */

import React, { useState } from 'react'
import { Button, Checkbox, Form, message, Modal, Space, Tooltip, Upload } from "antd"
import { ExclamationCircleTwoTone, UploadOutlined } from '@ant-design/icons'
import axios, { AxiosResponse } from "axios"


const inputFileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
const genAxiosUrl = (url: string, d: string[]) => {
  if (d.length === 0) return url
  let r = `${ url }?`
  if (d.includes("multiSheets")) r += "multiSheets=true"
  return r
}

export interface SheetStyle {
  name: string
  data: [][]
}

const axiosPost = (url: string, params: string[], data: any): Promise<AxiosResponse<SheetStyle[]>> =>
  axios.post(genAxiosUrl(url, params), data)

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}

export interface FileUploadModalProps {
  postingUrl: string
  setVisible: (value: boolean) => void
  visible: boolean
  upload: (value: SheetStyle[]) => void
  multiSheetDisable?: boolean
}

// todo: support CSV file, API should be modified as well
export const FileUploadModal = (props: FileUploadModalProps) => {
  const [form] = Form.useForm()

  const [uploading, setUploading] = useState<boolean>(false)
  const [uploadFiles, setUploadFiles] = useState<File[]>([])

  const uploadProps = {
    accept: inputFileType,
    multiple: false,
    beforeUpload: (file: File) => {
      setUploadFiles([file])
      return false
    },
    onRemove: () => setUploadFiles([]),
    fileList: uploadFiles.map((i, j) => ({ ...i, name: i.name, uid: String(j) }))
  }

  const onUploadFile = (params: string[]) => {
    if (uploadFiles.length !== 0) {
      const data = new FormData()
      data.append("xlsx_file", uploadFiles[0])
      setUploading(true)

      axiosPost(props.postingUrl, params, data)
        .then(res => {
          message.success(res.statusText)
          setUploading(false)
          setUploadFiles([])
          props.upload(res.data)
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
        const fo = values.fileOptions ? values.fileOptions : []
        onUploadFile(fo)
        onReset()
        props.setVisible(false)
      })
  }

  return (
    <Modal
      title='Please complete below:'
      visible={ props.visible }
      onOk={ onFinish }
      onCancel={ () => props.setVisible(false) }
      confirmLoading={ uploading }
      okText="Confirm"
      cancelText="Discard"
    >
      <Form { ...formItemLayout } form={ form }>
        <Form.Item name="fileUpload" label="File">
          <Space>
            <Upload { ...uploadProps }>
              <Button icon={ <UploadOutlined/> }>Click to upload</Button>
            </Upload>
            <Tooltip title="Please use pure Excel file!">
              <ExclamationCircleTwoTone twoToneColor="red"/>
            </Tooltip>
          </Space>
        </Form.Item>

        <Form.Item name="fileOptions" label="Options">
          <Checkbox.Group>
            <Checkbox
              value="multiSheets"
              disabled={ props.multiSheetDisable }
            >
              Multiple sheets
            </Checkbox>
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}

FileUploadModal.defaultProps = {
  multiSheetDisable: false
} as Partial<FileUploadModalProps>

